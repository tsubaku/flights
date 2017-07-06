<?php
// Здесь нужно сделать все проверки передавемых файлов и вывести ошибки если нужно
	
	require_once('./core/php/functions.php');
	
	// Скрипт проверки авторизации (если не авторизован, действие всего скрипта не выполняется)
	$level = 'user';
	protection($level);

$data = array();	// Переменная ответа

if( isset( $_GET['uploadfiles'] ) ){  
    $error = false;
    $files = array();

    $uploaddir = './core/uploads/'; //каталог для сохраняемых файлов
	
	# Создадим папку если её нет
	//if( ! is_dir( $uploaddir ) ) mkdir( $uploaddir, 0777 );

	// переместим файлы из временной директории в указанную
	foreach( $_FILES as $file ){
        
        #Проверка типа файла
        if($file['type'] == "image/jpeg") {
            $file['name'] = date('Y-m-d_H-i-s').".jpg";
        }
        elseif($file['type'] == "image/png") {
            $file['name'] = date('Y-m-d_H-i-s').".png";
        }
        elseif($file['type'] == "image/gif") {
            $file['name'] = date('Y-m-d_H-i-s').".gif";
        }
        else {
           // $error .= 'Изображения могут быть в формате JPG, PNG или GIF';
           $error = true;
           break;
        }

		
		if( move_uploaded_file( $file['tmp_name'], $uploaddir . basename($file['name']) ) ){
			
            $files[] = realpath( $uploaddir . $file['name'] );
			//chmod($uploaddir . basename($file['name']), 777);
			
            
            
			//Создание миниатюры
			//header('Content-Type: image/png'); //или /png /gif, т.е то что нам надо
			//createThumbnail($files[], 'false', 100, 100);	

        }
        else{
            $error = true;
        }
		
		//Записываем в таблицу photo 
		# Cоздать соединение
		$pdo = connectToBase();
	
		//Подготовить переменные и выполнить запрос к базе
		$stmt = $pdo->prepare('INSERT INTO `photo` (n_flight,path) VALUES(:flight_n, :file_name)');
		$stmt->execute(array('file_name' => $file['name'], 'flight_n' => $_POST['number_flight']));
    }
	
    $data = $error ? array('error' => 'Ошибка загрузки файлов.') : array('files' => $files );
	
	echo json_encode($data);
}
