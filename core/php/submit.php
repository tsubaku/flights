<?php
// Здесь нужно сделать все проверки передавемых файлов и вывести ошибки если нужно
	
	require_once('./functions.php');
	
	// Скрипт проверки авторизации (если не авторизован, действие всего скрипта не выполняется)
	$level = 'user';
	protection($level);

$data = array();	// Переменная ответа

if( isset( $_GET['uploadfiles'] ) ){  
    $error = false;
    $files = array();

    $uploaddir = './core/uploads/'; //каталог для сохраняемых файлов
	
	// Создадим папку если её нет
	if( ! is_dir( $uploaddir ) ) mkdir( $uploaddir, 0777 );

	// переместим файлы из временной директории в указанную
	foreach( $_FILES as $file ){
		$file['name'] = date('Y-m-d_H-i-s').".jpg";
		if( move_uploaded_file( $file['tmp_name'], $uploaddir . basename($file['name']) ) ){
            $files[] = realpath( $uploaddir . $file['name'] );
			
			//Создание миниатюры
			//header('Content-Type: image/png'); //или /png /gif, т.е то что нам надо
			//create_thumbnail($files[], 'false', 100, 100);		
        }
        else{
            $error = true;
        }
		//Записываем в таблицу photo 
	
		require_once('./functions.php');
		
		# Cоздать соединение
		$pdo = connectToBase();
	
		//Подготовить переменные и выполнить запрос к базе
		$stmt = $pdo->prepare('INSERT INTO `photo` (n_flight,path) VALUES(:flight_n, :file_name)');
		$stmt->execute(array('file_name' => $file['name'], 'flight_n' => $_POST['number_flight']));
    }
	
    $data = $error ? array('error' => 'Ошибка загрузки файлов.') : array('files' => $files );
	
	echo json_encode($data);
}
