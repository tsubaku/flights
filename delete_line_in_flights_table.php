<?php
//Удаляем строку
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
	$id_line = $value[0]; 		//id строки
	$table   = $value[1]; 		//Название БД, в которой будем удалять строку
	$year 	 = $value[2]; 		//Год
	$month 	 = $value[3]; 		//Месяц
	//echo "< /br> $id_line, $table, $year, $month < /br>";
	
	require_once('./functions.php');
	
	// Скрипт проверки авторизации (если не авторизован, действие всего скрипта не выполняется)
	$level = 'manager';
	protection($level);
	
	$pdo = connectToBase();
	
	//Подготовить переменные и выполнить запрос к базе
	if ($table == '10') { 
		$stmt = $pdo->prepare('DELETE FROM users WHERE `user_id`= :id_line');
		$stmt->execute(array('id_line' => $id_line));

	} else {
		$stmt = $pdo->prepare('DELETE FROM flights WHERE `id` = :id_line');	
		$stmt->execute(array('id_line' => $id_line));
	}	
	f_show_table ($year, $month, $user_id);
?>
	
				