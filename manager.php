<?php  
	require_once('./core/php/functions.php');
	
	# Проверка авторизации пользователя
	$level = 'manager';
	protection($level);
	$user_id = protection($level);
	
	//print "Привет, ".$userdata['user_login'].". Всё работает!";
	//$user_id = $userdata['user_id'];

	// загружаем шаблон  
	require_once('./core/template/manager.html');

?>