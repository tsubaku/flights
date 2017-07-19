<?php
header("Content-type: text/html; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);

// echo "Ajax проработал запрос";

require_once "./functions.php";

$level = 'manager';
verifyAuthorization($level);

$sentData = array();
foreach ($_POST as $key => $val) {
    $sentData[$key] = $val;
}

$year    = $sentData['year']; //Год
$month   = $sentData['month']; //Месяц

//Показать таблицу
showTable($year, $month);



?>