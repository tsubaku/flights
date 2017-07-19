<?
// Страница авторизации

require_once('./core/php/functions.php');

$pdo = connectToBase();

if (isset($_POST['submit'])) {
    # Вытаскиваем из БД запись, у которой логин равняеться введенному
    $stmt = $pdo->prepare('SELECT user_id, user_password FROM users WHERE user_login = :login LIMIT 1');
    $stmt->execute(array(
        'login' => $_POST['login']
    ));
    $data = $stmt->fetchAll(); //Обработать запрос, переведя ВСЕ данные в массив $data
    
    # Сравниваем пароли
    //$enteredPass = password_hash(trim($_POST['password']), PASSWORD_DEFAULT);
    if (password_verify($_POST['password'], $data[0]['user_password'])) {
        # Генерируем случайное число и шифруем его
        $hash    = password_hash(generateCode(10), PASSWORD_DEFAULT);
        $user_id = $data[0]['user_id'];
        
        # Записываем в БД новый хеш авторизации и IP
        $stmt = $pdo->prepare('UPDATE users SET `user_hash` = :hash  WHERE `user_id` = :user_id');
        $stmt->execute(array(
            'hash' => $hash,
            'user_id' => $user_id
        ));
        
        # Ставим куки
        setcookie("id", $data[0]['user_id'], time() + 60 * 60 * 24 * 30);
        setcookie("hash", $hash, time() + 60 * 60 * 24 * 30);
        
        # Переадресовываем браузер на главную страницу проверки нашего скрипта
        header("Location: index.php");
        exit();
    } else {
        print "Вы ввели неправильный логин/пароль $enteredPass";
    }
}

// загружаем шаблон  
require_once('./core/template/login.html');
?>