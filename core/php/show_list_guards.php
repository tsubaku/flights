<?php
header("Content-type: text/plain; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);

// echo "Ajax проработал запрос";

require_once('./functions.php');

// Скрипт проверки авторизации (если не авторизован, действие всего скрипта не выполняется)
$level = 'manager';
verifyAuthorization($level);

$table_users = '10'; //охранники             !!! Костыль !!!

$pdo = connectToBase(); // Cоздать соединение
//Подготовить переменные и выполнить запрос к базе
$stmt        = $pdo->prepare('SELECT `user_id`, `user_login`, `full_name` FROM `users`');
$data_from   = "01";
$data_before = "31";
$stmt->execute(array(
    'data_from' => $data_from,
    'data_before' => $data_before
));

$table_array = $stmt->fetchAll();                               //Обработать запрос, переведя ВСЕ данные в массив $table_array
$stmt        = $pdo->query('SELECT `full_name` FROM `users`');  //Подготовить переменные и выполнить запрос к базе

$users_array = array();                                         //
$k = 0;
while ($row = $stmt->fetch()) {
    if ($row['full_name'] != 'Менеджер') {
        $users_array[$k] = $row['full_name'];
        $k               = $k + 1;
    }
    //echo "$row";
}

if ($users_array != NULL) { //иначе варнинги идут, если рейсов нет
    $column_name_array = array_keys($table_array[0]); //$column_name_array - массив имён столбцов таблицы
    //print_r($column_name_array);
    
    //Рисуем таблицу
    echo "<table>";
    echo "<caption><strong>Список зарегистрированных охранников</strong></caption>"; //Название таблицы
    echo "<tr>";
    echo "<td><strong>№</strong></td>"; //выводим "№" 
    $ru_rows_array = array(
        "Логин",
        "Фамилия",
        "del"
    );

    foreach ($ru_rows_array as $value) {
        echo "<td><strong>" . $value . "</strong></td>"; //Рисуем шапку
    }
    
    $i = 1;
    foreach ($table_array as $key_id => $row_content) { //$key_id - номер строки в таблице, $row_content - массив ячеек в ряду
        echo "<tr>";
        echo "<td><input type='text' id='number_guard-$i' class='number' value='$i' disabled='disabled'> </input></td>"; //Вывод № строки
        $i = $i + 1;
        
        $user_id     = $row_content['user_id'];        //id охранника
        $user_login  = $row_content['user_login'];     //login охранника
        $full_name   = $row_content['full_name'];      //Фамилия охранника

        $button      = "<div class='container_default'><button type='button' class='a_button_delete' onclick='delete_line($user_id, $table_users);'></button></div>";

                
        //Вставляем в таблицу все данные, кроме id
        echo "<td><div class='container_default'><input readonly type='text' id='user_login-$user_id' name='user_login-$user_id' class='' value='$user_login' ></input></div></td>"; 
   
        echo "<td><div class='container_default'><input readonly type='text' id='full_name-$user_id' name='full_name-$user_id' class='' value='$full_name'></input></div></td>";
        echo "<td>$button</td>";
        echo "</tr>";
    }
    echo "</table>";
}
unset($row_content); // разорвать ссылку на последний элемент




?>