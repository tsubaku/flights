<?php
	header("Content-type: text/plain; charset=utf-8");
	header("Cache-Control: no-store, no-cache, must-revalidate");
	header("Cache-Control: post-check=0, pre-check=0", false);
	sleep(1); // время ожидания
	// echo "Ajax проработал запрос";

	$value = array (0 => "57");
	$i = 0;
	while(list ($key, $val) = each ($_POST)){
		$value[$i] = $val;
		$i = $i + 1;		
	}
	$object_operation_name = $value[0]; //

	require_once('./functions.php');
	
	// Скрипт проверки авторизации (если не авторизован, действие всего скрипта не выполняется)
	$level = 'manager';
	protection($level);
	
	$table_users = '10'; //охранники 			!!! Костыль !!!
	
	# Cоздать соединение
	$pdo = connectToBase();

	//Подготовить переменные и выполнить запрос к базе
	$stmt = $pdo->prepare('SELECT `user_id`, `user_login`, `full_name` FROM `users`');
	$data_from = "01";
	$data_before = "31";
	$stmt->execute(array('data_from' => $data_from, 'data_before' => $data_before));
	//Обработать запрос, переведя ВСЕ данные в массив $table_array
	$table_array = $stmt->fetchAll();	
	//Подготовить переменные и выполнить запрос к базе
	$stmt = $pdo->query('SELECT `full_name` FROM `users`');	//
	//Обработать запрос, переведя ВСЕ данные в массив $table_array
	$users_array = array();
	$k = 0;
	while ($row = $stmt->fetch()) {
		if ($row['full_name'] != 'Менеджер') {
			$users_array[$k] = $row['full_name'];			
			$k = $k + 1;
		}
		//echo "$row";
	}
	
	if ($users_array != NULL){ //иначе варнинги идут, если рейсов нет
		$column_name_array = array_keys($table_array[0]); //$column_name_array - массив имён столбцов таблицы
		//print_r($column_name_array);
		
		//Рисуем таблицу
		echo "<table>"; 
		echo "<caption><strong>Список зарегистрированных охранников</strong></caption>"; 	//Название таблицы
		echo "<tr>";
		echo "<td><strong>№</strong></td>";									//выводим "№" 
		$ru_rows_array = array("Логин", "Фамилия", "del");
		$i = 0;
		while ($i <= count($column_name_array)){ 							//Рисуем шапку таблиц			
			echo "<td class='$cell_class'><strong>".$ru_rows_array[$i]."</strong></td>";//Рисуем шапку
			$i = $i + 1;
		}		
		echo "</tr>";


		foreach ($table_array as $key_id => $row_content) { //$key_id - номер строки в таблице, $row_content - массив ячеек в ряду
			echo "<tr>";
				echo "<td><input type='text' id='number_guard$key_id' class='number' value='".$key_id."' disabled='disabled'> </input></td>"; //Вывод № строки
				$id_line = $row_content['user_id']; //$id_line - id строки в БД
				$id_status = $row_content['fakticheskij_srok_dostavki']; 	//$id_status - status строки в БД
				
				foreach ($row_content as $column_name => $data){
					//Определяем переменные для каждой ячейки строки
					$container = "container_default";
					$status_class = "";
					$readonly = "";
					$type = "text";
					$fio ="";
					switch ($column_name) {							
						case 'data_vyezda':
							$type = "date"; //Ставим в ячейку дату;
						break;	

						default:		
						break;		
					}
					
					//Если столбец ФИО, то рисуем тег select со списком охранников
					if ($column_name != 'user_id'){
						echo "<td ><div class='$container'><input $readonly type='$type' id='$column_name-$id_line' name='$column_name-$id_line' class='$column_name $status_class' value='$data' ></input></div></td>"; //$data - содержимое ячейки
					} else {
					$button = "<div class='$container'><a href='#' class='a_button_delete' onclick='delete_line($data, $table_users);'></a></div>";
					}
				}
				echo "<td>$button</td>"; 
			echo "</tr>";
		}
		echo "</table>";
	} 
	unset($row_content); // разорвать ссылку на последний элемент
		


		
		
		
		
		

	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
?>
	
				