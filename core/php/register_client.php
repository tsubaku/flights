<?php
# Страница регистрации нового пользователя

// echo "Ajax проработал запрос";

$sentData = array();
foreach ($_POST as $key => $val) {
    $sentData[$key] = $val;
}
$client = $sentData['client']; //

$result = array(
    0 => "0",
    1 => ""
); //результат регистрации. Статус: 0 - успешно, 1 - есть ошибки

require_once('./functions.php');

// Скрипт проверки авторизации (если не авторизован, действие всего скрипта не выполняется)
$level = 'manager';
verifyAuthorization($level);

# Cоздать соединение
$pdo = connectToBase();

$err = array();

# проверяем, не сущестует ли клиент с таким именем
$stmt = $pdo->prepare('SELECT client FROM clients WHERE client = :client');
$stmt->execute(array(
    'client' => $client
));
$data = $stmt->fetch();
if ($data) {
    $err[] = "Клиент с таким именем уже существует в базе данных";
}

# Если нет ошибок, то добавляем в БД нового клиента
if (count($err) == 0) {
    $stmt = $pdo->prepare('INSERT INTO clients SET client = :client');
    $stmt->execute(array(
        'client' => $client
    ));
} else {
    $result[1] .= "<b>При регистрации произошли следующие ошибки:</b><br>";
    foreach ($err AS $error) {
        //echo "$error.'<br>'";
        $result[1] .= "$error.<br>";
    }
}

header("Content-type: application/json; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
echo json_encode($result);

?>