<?php
	
	//sleep(1); // время ожидания
	// echo "Ajax проработал запрос";
	
	$sentData = array ();
	foreach ($_POST as $key => $val) {
		$sentData[$key] = $val;
	}
	$date_flights = $sentData['date_flights']; 	//Дата рейса
	$user_id = $sentData['user_id']; 			//ФИО человека, по которому будет создана выборка из БД
	
	//Показать таблицу
	//f_show_table ($year, $month, $user_id);
	
	$date_flights_mysql = date('Y-m-d', strtotime($date_flights)); //php date dd.mm.yyyy to mysql format 'YYYY-MM-DD'

	
	require_once('./functions.php');
	
	// Скрипт проверки авторизации (если не авторизован, действие всего скрипта не выполняется)
	//require_once('./protection.php');
	$level = 'user';
	protection($level);
	
	# Cоздать соединение
	$pdo = connectToBase();
	
	//Подготовить переменные и выполнить запрос к базе
	$stmt = $pdo->prepare('SELECT `id`,`data_vyezda`, `vremja`, `klient`, `nomer_mashiny`, `prinjatie_pod_ohranu`, `sdacha_s_ohrany`, `prinjatie`, `sdacha`, `status` FROM `flights` WHERE (data_vyezda = :date_flights_mysql) AND `fio` = (SELECT `full_name` FROM `users` WHERE `user_id` = :user_id) GROUP BY `id`');

	$stmt->execute(array('date_flights_mysql' => $date_flights_mysql, 'user_id' => $user_id));
	
	//Обработать запрос, переведя ВСЕ данные в массив $table_array
	$table_array = $stmt->fetchAll();
	//print_r($table_array[0]);
	//print_r($table_array[1]['vremja']);
	
	$column_name_array = array_keys($table_array[0]); //$column_name_array - массив имён столбцов таблицы
	
	foreach ($table_array as $key_id => $row_content) { //$key_id - номер строки в таблице, $row_content - массив ячеек в ряду
		//echo "<tr>";
		//echo "<td><input type='text' id='number_line$key_id' value='".$key_id."' disabled='disabled'> </input></td>"; //Вывод № строки
		$id_line = $row_content['id']; //$id_line - id строки в БД
		$array_data_one_flight = array();
		$i = 0;
		foreach ($row_content as $column_name => $data){
			//print_r($data);
			$array_data_one_flight[$i] = $data;
			$i = $i + 1;
			
		}
	}
	header("Content-type: application/json; charset=utf-8");
	header("Cache-Control: no-store, no-cache, must-revalidate");
	header("Cache-Control: post-check=0, pre-check=0", false);
	echo json_encode( $array_data_one_flight );
			
?>
	
				