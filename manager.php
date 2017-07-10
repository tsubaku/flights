<?php  
	require_once('./core/php/functions.php');
	
	# Проверка авторизации пользователя
	$level      = 'manager';
	protection($level);
	
    $user_info  = protection($level);
	
    $user_id    = $user_info['user_id'];
    $user_level = $user_info['user_level'];
    $full_name  = $user_info['full_name'];

	# Загружаем шаблон  
	require_once('./core/template/manager.html');

?>