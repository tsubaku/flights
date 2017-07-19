 <?php 
 #Страница охранника

require_once('./core/php/functions.php');

#Проверка авторизации пользователя
$level = 'user';
verifyAuthorization($level);

$user_info  = verifyAuthorization($level);
$user_id    = $user_info['user_id'];
$user_level = $user_info['user_level'];
$full_name  = $user_info['full_name'];

#Вытаскиваем из базы даты выездов нужного охранника    
$pdo  = connectToBase(); 
$stmt = $pdo->prepare("SELECT `data_vyezda` FROM `flights` WHERE `fio` = :full_name");
$stmt->execute(array(
    'full_name' => $full_name
));
$table_array = $stmt->fetchAll(); //$table_array - массив всех дат выезда указанного охранника

$array_date_of_departure = Array();
$i                       = 0;
foreach ($table_array as $date_of_departure) {
    $array_date_of_departure[$i] = $date_of_departure['data_vyezda'];
    $i                           = $i + 1;
}

$js_array = json_encode($array_date_of_departure); //масив дат выездов

#Отправляем js-скрипту:
echo '<script language="javascript">var user_id_current = ' . $user_id . ';</script>'; //id
echo '<script language="javascript">var array_date_of_departure = ' . $js_array . ';</script>'; //масив дат выездов

$qq = 5;
$qq = ++$qq + ++$qq;
echo '<script language="javascript">var qq = ' . $qq . ';</script>'; //масив дат выездов

# Загружаем шаблон охранника
require_once('./core/template/guard.html');

?> 