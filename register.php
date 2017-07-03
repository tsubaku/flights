<?php  
# Страница регистрации нового пользователя

	//sleep(1); // время ожидания
	// echo "Ajax проработал запрос";

	$value = array (0 => "57");
	$i = 0;
	while(list ($key, $val) = each ($_POST)){
		$value[$i] = $val;
		$i = $i + 1;		
	}
	$login 		= $value[0]; //
	$pass	 	= $value[1]; //
	$full_name 	= $value[2]; //
	
	$result = array(0 => "0", 1 => ""); //результат регистрации. Статус: 0 - успешно, 1 - есть ошибки
		
	require_once('./functions.php');
	
	// Скрипт проверки авторизации (если не авторизован, действие всего скрипта не выполняется)
	$level = 'manager';
	protection($level);
	
	# Cоздать соединение
	$pdo = connectToBase();
	
	$err = array();

	# проверям логин
	if(!preg_match("/^[a-zA-Z0-9]+$/",$login)) {
		$err[] = "Логин может состоять только из букв английского алфавита и цифр";
	}
	
	if(strlen($login) < 3 or strlen($login) > 30) {
		$err[] = "Логин должен быть не меньше 3-х символов и не больше 30";
	}

	# проверяем, не сущестует ли пользователя с таким именем
	$stmt = $pdo->prepare('SELECT user_id FROM users WHERE user_login = :login');
	$stmt->execute(array('login' => $login));
	$data = $stmt->fetch(); 
	if ($data) {
		$err[] = "Пользователь с таким логином уже существует в базе данных";
	}
	
	# Если нет ошибок, то добавляем в БД нового пользователя
	if(count($err) == 0)	{
		# Убераем лишние пробелы и делаем шифрование
		//$pass = md5(md5(trim($pass)));	
		$pass = password_hash(trim($pass), PASSWORD_DEFAULT);
		
		$stmt = $pdo->prepare('INSERT INTO users SET user_login = :login, user_password = :pass, full_name = :full_name');	
		//$stmt = $pdo->prepare('INSERT INTO users (user_login, user_password) VALUES (:login, :pass)');	 //как вариант
		$stmt->execute(array('login' => $login, 'pass' => $pass, 'full_name' => $full_name));
	}
	else	{
		$result[1] .= "<b>При регистрации произошли следующие ошибки:</b><br>";
		foreach($err AS $error)	{
			//echo "$error.'<br>'";
			$result[1] .= "$error.<br>";
		}
	}
	
	header("Content-type: application/json; charset=utf-8");
	header("Cache-Control: no-store, no-cache, must-revalidate");
	header("Cache-Control: post-check=0, pre-check=0", false);
	echo json_encode($result);

?>


