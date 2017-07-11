<?php
//Показать выбранный рейс охраннику

// echo "Ajax проработал запрос";

$sentData = array();
foreach ($_POST as $key => $val) {
    $sentData[$key] = $val;
}
$date_flights = $sentData['date']; //Дата рейса
$user_id      = $sentData['user_id']; //ФИО человека, по которому будет создана выборка из БД

//print_r($date_flights);


$date_flights_mysql = date('Y-m-d', strtotime($date_flights)); //php date dd.mm.yyyy to mysql format 'YYYY-MM-DD'


require_once('./functions.php');

// Скрипт проверки авторизации (если не авторизован, действие всего скрипта не выполняется)
$level = 'user';
verifyAuthorization($level);

# Cоздать соединение
$pdo = connectToBase();

//Подготовить переменные и выполнить запрос к базе
$stmt = $pdo->prepare('SELECT `id`,`data_vyezda`, `vremja`, `klient`, `nomer_mashiny`, `prinjatie_pod_ohranu`, `sdacha_s_ohrany`, `prinjatie`, `sdacha`, `status` FROM `flights` WHERE (`data_vyezda` = :date_flights_mysql) AND `fio` = (SELECT `full_name` FROM `users` WHERE `user_id` = :user_id) GROUP BY `id`');

$stmt->execute(array(
    'date_flights_mysql' => $date_flights_mysql,
    'user_id' => $user_id
));

//Обработать запрос, переведя ВСЕ данные в массив $table_array
$table_array = $stmt->fetchAll();
//print_r($table_array[0]);
//print_r($table_array[0]['vremja']);

$array_data_one_flight = array();
foreach ($table_array as $key_id => $row_content) { //$key_id - номер строки в таблице, $row_content - ячейка в ряду
    $i = 0;
    foreach ($row_content as $column_name => $data) {
        //print_r($data);
        $array_data_one_flight[$i] = $data;
        $i                         = $i + 1;
    }
}

header("Content-type: application/json; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
echo json_encode($array_data_one_flight);

?>