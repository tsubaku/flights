<?php
//Вставляем пустую строку
header("Content-type: text/plain; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);

// echo "Ajax проработал запрос";

$sentData = array();
foreach ($_POST as $key => $val) {
    $sentData[$key] = $val;
}
$year    = $sentData['year']; //Год
$month   = $sentData['month']; //Месяц
//$user_id = $sentData['user_id']; //ФИО человека, по которому будет создана выборка из БД

require_once('./functions.php');

# Скрипт проверки авторизации (если не авторизован, действие всего скрипта не выполняется)
$level  = 'manager';
protection($level);

$pdo    = connectToBase();

//Добавляем пустую строку
$stmt   = $pdo->query('INSERT INTO `flights` () VALUES()');

showTable($year, $month);



?>