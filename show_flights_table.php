<?php
	header("Content-type: text/plain; charset=utf-8");
	header("Cache-Control: no-store, no-cache, must-revalidate");
	header("Cache-Control: post-check=0, pre-check=0", false);
	sleep(1); // время ожидания
	// echo "Ajax проработал запрос";
	
	require_once "functions.php";
	
	// Скрипт проверки авторизации (если не авторизован, действие всего скрипта не выполняется)
	//require_once('./protection.php');
	
	$level = 'manager';
	protection($level);
	
	$value = array (0 => "57");
	$i = 0;
	while(list ($key, $val) = each ($_POST)){
		$value[$i] = $val;
		$i = $i + 1;		
	}
	$year = $value[0]; 			//Год
	$month = $value[1]; 		//Месяц
	$user_id = $value[2]; 		//ФИО человека, по которому будет создана выборка из БД
	
	//Показать таблицу
	f_show_table ($year, $month, $user_id);

	
	
?>
	
				