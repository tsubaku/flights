<?php  #Страница охранника

	require_once('./core/php/functions.php');
	
	# Проверка авторизации пользователя
	$level = 'user';
	protection($level);

	//print "Привет, ".$userdata['user_login'].". Всё работает!";
	$user_id = protection($level);
	echo '<script language="javascript">var user_id_current = '.$user_id.';</script>';
	
	// Загружаем шаблон охранника
	require_once('./core/template/guard.html');

?>