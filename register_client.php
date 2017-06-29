<?php  
# Страница регистрации нового пользователя

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
	$client 		= $value[0]; //
	//$pass	 	= $value[1]; //
	//$full_name 	= $value[2]; //
	
	$result = array(0 => "0", 1 => ""); //результат регистрации. Статус: 0 - успешно, 1 - есть ошибки
		
	require_once('./functions.php');
	
	// Скрипт проверки авторизации (если не авторизован, действие всего скрипта не выполняется)
	$level = 'manager';
	protection($level);
	
	# Cоздать соединение
	$pdo = connectToBase();
	
	$err = array();

	# проверям логин
	//if(!preg_match("/^[a-zA-Z0-9]+$/",$client)) {
	//	$err[] = "Логин может состоять только из букв английского алфавита и цифр";
	//}
	
	//if(strlen($client) < 3 or strlen($client) > 30) {
	//	$err[] = "Логин должен быть не меньше 3-х символов и не больше 30";
	//}

	# проверяем, не сущестует ли клиент с таким именем
	$stmt = $pdo->prepare('SELECT client FROM clients WHERE client = :client');
	$stmt->execute(array('client' => $client));
	$data = $stmt->fetch(); 
	if ($data) {
		$err[] = "Клиент с таким именем уже существует в базе данных";
	}
	
	# Если нет ошибок, то добавляем в БД нового клиента
	if(count($err) == 0)	{
		# Убераем лишние пробелы и делаем двойное шифрование
		$pass = md5(md5(trim($pass)));	
		
		$stmt = $pdo->prepare('INSERT INTO clients SET client = :client');	
		$stmt->execute(array('client' => $client));
	}
	else	{
		$result[1] .= "<b>При регистрации произошли следующие ошибки:</b><br>";
		foreach($err AS $error)	{
			//echo "$error.'<br>'";
			$result[1] .= "$error.<br>";
		}
	}
	
	echo json_encode($result);

?>


