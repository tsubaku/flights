<?php
//Удаляем строку
header("Content-type: text/plain; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);

// echo "Ajax проработал запрос";

$sentData = array();
foreach ($_POST as $key => $val) {
    $sentData[$key] = $val;
}
$id_line = $sentData['id_line']; //id строки
$table   = $sentData['table'];   //Название БД, в которой будем удалять строку
$year    = $sentData['year'];    //Год
$month   = $sentData['month'];   //Месяц
//echo "< /br> $id_line, $table, $year, $month < /br>";

require_once('./functions.php');

// Скрипт проверки авторизации (если не авторизован, действие всего скрипта не выполняется)
$level = 'manager';
protection($level);

$pdo = connectToBase();

//Подготовить переменные и выполнить запрос к базе
if ($table == '10') {
    $stmt = $pdo->prepare('DELETE FROM users WHERE `user_id`= :id_line');
    $stmt->execute(array(
        'id_line' => $id_line
    ));
    
}
if ($table == '11') {
    $stmt = $pdo->prepare('DELETE FROM clients WHERE `id`= :id_line');
    $stmt->execute(array(
        'id_line' => $id_line
    ));
    
} else {
    $stmt = $pdo->prepare('DELETE FROM flights WHERE `id` = :id_line');
    $stmt->execute(array(
        'id_line' => $id_line
    ));
}

showTable($year, $month, $user_id);

?>
	
				