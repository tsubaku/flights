<?php
	header("Content-type: text/plain; charset=utf-8");
	header("Cache-Control: no-store, no-cache, must-revalidate");
	header("Cache-Control: post-check=0, pre-check=0", false);
	sleep(1); // время ожидания
	// echo "Ajax проработал запрос";

	$value = array ();
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
	
	$table_users = '11'; //клиенты 			!!! Костыль !!!
	
	# Cоздать соединение
	$pdo = connectToBase();
	
	$stmt = $pdo->query('SELECT `id`, `client` FROM `clients`');	//Подготовить и выполнить запрос к базе	
	$table_array = $stmt->fetchAll();//Обработать запрос, переведя ВСЕ данные в массив $table_array	

	echo "<table>"; 
		echo "<caption><strong>Список наших клиентов</strong></caption>"; 	//Название таблицы
		echo "<tr>";
		$ru_rows_array = array("№", "Название", "del");
		$i = 0;
		while ($i <= count($ru_rows_array)-1){ 							
			echo "<td><strong>".$ru_rows_array[$i]."</strong></td>";//Рисуем шапку
			$i = $i + 1;
		}		
		echo "</tr>";

		$i = 1;
		foreach($table_array as $item) {
			echo "<tr>";
			echo "<td><input type='text' id='number_client-$i' class='number' value='".$i."' disabled='disabled'> </input></td>"; //Вывод № строки
			$i = $i + 1;
			
			$id = $item['id'];			//id клиента
			$client = $item['client']; 	//Название клиента
			
			$container = "container_default";
			$readonly = "readonly";
			$type = "text";
			$button = "<div class='$container'><a href='#' class='a_button_delete' onclick='delete_line($id, $table_users);'></a></div>";
		
			echo "<td><div class='$container'><input $readonly type='$type' id='client-$id' name='client-$id' class='client' value='$client' ></input></div></td>"; 		
			
			echo "<td>$button</td>"; 
 
			echo "</tr>";			
			echo "<br />";
		}
	echo "</table>";
	
	
	unset($row_content); // разорвать ссылку на последний элемент
		


		
		
		
		
		

	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
?>
	
				