<?php  

	#Переадресация при открытии общего каталога сайта
	
	// Скрипт проверки
	require_once('./core/php/functions.php');
	
	$user_info = verifyAuthorization('what_level');	
	
	if ($user_info['user_level'] == 'manager') {
		header("Location: manager.php"); exit(); //Менеджеру менеджерово
	}
	else {
		header("Location: guard.php"); exit();	//Охраннику охранниково
	}
 
?>


