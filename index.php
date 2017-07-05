<?php  

	#Переадресация при открытии общего каталога сайта
	
	// Скрипт проверки
	require_once('./core/php/functions.php');
	
	$user_level = protection('what_level');	
	//echo "$user_level";
	
	if ($user_level == 9) {
		header("Location: manager.php"); exit(); //Менеджеру менеджерово
	}
	else {
		header("Location: guard.php"); exit();	//Охраннику охранниково
	}
 
?>


