<?php  
	require_once('./core/php/functions.php');
	
	# Проверка авторизации пользователя
	$level      = 'manager';
	verifyAuthorization($level);
	
    $user_info  = verifyAuthorization($level);
	
    $user_id    = $user_info['user_id'];
    $user_level = $user_info['user_level'];
    $full_name  = $user_info['full_name'];

    #Отправляем js-скрипту:
    echo '<script language="javascript">var user_id_current = '.$user_id.';</script>';          //id
    
	# Загружаем шаблон  
	require_once('./core/template/manager.html');

?>