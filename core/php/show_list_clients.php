<?php
header("Content-type: text/plain; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);

// echo "Ajax проработал запрос";

require_once('./functions.php');

// Скрипт проверки авторизации (если не авторизован, действие всего скрипта не выполняется)
$level = 'manager';
protection($level);

$table_users = '11'; //клиенты             !!! Костыль !!!

$pdo         = connectToBase(); // Cоздать соединение
$stmt        = $pdo->query('SELECT `id`, `client` FROM `clients`'); //Подготовить и выполнить запрос к базе    
$table_array = $stmt->fetchAll(); //Обработать запрос, переведя ВСЕ данные в массив $table_array    

echo "<table>";
echo "<caption><strong>Список наших клиентов</strong></caption>"; //Название таблицы
echo "<tr>";
$ru_rows_array = array(
    "№",
    "Название",
    "del"
);


foreach ($ru_rows_array as $value) {
    echo "<td><strong>" . $value . "</strong></td>"; //Рисуем шапку
}

$i = 1;
foreach ($table_array as $item) {
    echo "<tr>";
    echo "<td><input type='text' id='number_client-$i' class='number' value='$i' disabled='disabled'> </input></td>"; //Вывод № строки
    $i = $i + 1;
    
    $id     = $item['id'];      //id клиента
    $client = $item['client'];  //Название клиента
    
    $button    = "<div class='container_default'><button type='button' class='a_button_delete' onclick='delete_line($id, $table_users);'></button></div>";
 
    //Вставляем в таблицу все данные, кроме id
    echo "<td><div class='container_default'><input readonly type='text' id='client-$id' name='client-$id' class='client' value='$client' ></input></div></td>";
    
    echo "<td>$button</td>";
    
    echo "</tr>";
}
echo "</table>";

unset($row_content); // разорвать ссылку на последний элемент



?>