<?php
// Функция, показывающая при клике по значку "Фото" фотографии, приаттаченные к рейсу

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
	$id_line = $value[0]; 			//id рейса, для которого ищем фото
	
	require_once('./functions.php');

	// Скрипт проверки авторизации (если не авторизован, действие всего скрипта не выполняется)
	$level = 'user';
	protection($level);
	
	# Cоздать соединение
	$pdo = connectToBase();
	
	//Подготовить переменные и выполнить запрос к базе
	$stmt = $pdo->prepare('SELECT `path` FROM `photo` WHERE `n_flight` = :id_line');
	$stmt->execute(array('id_line' => $id_line));
	$photo_name_array = $stmt->fetchAll(); //Обработать запрос, переведя ВСЕ данные из строки с id = $id_line в массив $photo_name_array
	
	$i = 0;
	$photo_array = array(0 => "Фотографии отсутствуют");
    foreach($photo_name_array as $val){ 
		//$tt = "<img src='uploads/$val[path]' width='250'  alt='Фото $val[path]' title='$val[path]' />";
		$tt = "<li><a href='uploads/$val[path]' onclick='selectPhoto();'><figure class='photo_prev'><img id='photo$i' src='uploads/$val[path]' height='100' alt='$val[path]' title='$val[path]'> <figcaption>$val[path]</figcaption></figure></a></li>";
		$photo_array[$i] = $tt;
		$i = $i+1;
	} 
	//echo "$photo_name_array";
	echo json_encode( $photo_array );
