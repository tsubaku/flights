<?php
// echo "Ajax проработал запрос";

$sentData = array();
foreach ($_POST as $key => $val) {
    $sentData[$key] = $val;
}
$cell_value   = $sentData['cell_value']; //Содержимое ячейки
$id_in_db     = $sentData['id_in_db']; //id строки с ячейкой
$column_in_db = $sentData['column_in_db']; //название столбца с ячейкой

require_once('./functions.php');

// Скрипт проверки авторизации (если не авторизован, действие всего скрипта не выполняется)
$level = 'user';
verifyAuthorization($level);

# Cоздать соединение
$pdo = connectToBase();

#Обновить ячейку в таблице 
//!!! ПОДСТАНОВКА $column_in_db НЕБЕЗОПАСНА, СДЕЛАТЬ ПРОВЕРКУ !!!
$stmt = $pdo->prepare("UPDATE flights SET $column_in_db = :cell_value  WHERE `id` = :id_in_db");
$stmt->execute(array(
    'cell_value' => $cell_value,
    'id_in_db' => $id_in_db
));

#Пересчитать, записать и заново вывести связанные ячейки    
//Подготовить переменные и выполнить запрос к базе
$stmt = $pdo->prepare('SELECT * FROM `flights` WHERE `id` = :id_in_db');
$stmt->execute(array(
    'id_in_db' => $id_in_db
));

//Обработать запрос, переведя ВСЕ данные из строки с id = $id_in_db в массив $line_array
$line_array = $stmt->fetchAll();
//print_r($line_array);
//print_r($line_array[1]['schet']);

$column_name_array = array_keys($line_array[0]); //$column_name_array - массив имён столбцов таблицы
//echo "$column_name_array";    

//Просчёт связанных ячеек
$res_array = array();
switch ($column_in_db) {
    case 'prostoj_summa':
    case 'stavka_bez_nds':
    case 'stavka_s_nds':
        //echo "Счёт: $line_array[schet]";
        //print_r ($line_array[0]['schet']);
        $prostoj_summa  = intval($line_array[0]['prostoj_summa']);
        $stavka_bez_nds = intval($line_array[0]['stavka_bez_nds']);
        $stavka_s_nds   = intval($line_array[0]['stavka_s_nds']);
        $schet          = $prostoj_summa + $stavka_bez_nds + $stavka_s_nds;
        
        $stmt = $pdo->prepare('UPDATE flights SET `schet`=:schet WHERE `id` = :id_in_db');
        $stmt->execute(array(
            'schet' => $schet,
            'id_in_db' => $id_in_db
        ));
        //$line_array = $stmt->fetchAll();
        //array_push($res_array, 'schet'=>$schet);
        $res_array["schet"] = $schet; // Это добавляет к массиву новый элемент с ключом "schet"
        break;
    
    case 'prinjatie': //datetime(6)
    case 'sdacha': //datetime(6)
        //    $prinjatie = $line_array[0]['prinjatie'];         //2017-03-07 13:44:00.000000
        //    $sdacha = $line_array[0]['sdacha'];            
        //    $fakticheskij_srok_dostavki = $sdacha - $prinjatie; // 2 - разница в годах(?)
        $prinjatie = strtotime($line_array[0]['prinjatie']); //1488883260 - секунд Unix
        $sdacha    = strtotime($line_array[0]['sdacha']);
        
        if ($prinjatie <= $sdacha) {
            $fakticheskij_srok_dostavki = $sdacha - $prinjatie; // 60 - разница в секундах
            $hh                         = intval($fakticheskij_srok_dostavki / 3600);
            $mm                         = intval($fakticheskij_srok_dostavki / 60) - $hh * 60;
            if ($mm < 10) {
                $mm = "0" . "$mm";
            }
            if ($hh < 10) {
                $hh = "0" . "$hh";
            }
            $fakticheskij_srok_dostavki = $hh . ":" . $mm; //string    
            
        } else {
            $fakticheskij_srok_dostavki = "--:--"; // 
        }
        
        if ($sdacha == NULL) {
            $fakticheskij_srok_dostavki = "В рейсе"; // 
        }
        if ($prinjatie == NULL) {
            $fakticheskij_srok_dostavki = "--:--"; // 
        }
        
        $res_array["fakticheskij_srok_dostavki"] = $fakticheskij_srok_dostavki; //Доб.к массиву новый эл.с ключом fakticheskij_srok_dostavki
        
        $stmt = $pdo->prepare('UPDATE flights SET `fakticheskij_srok_dostavki`=:fakticheskij_srok_dostavki WHERE `id` = :id_in_db');
        $stmt->execute(array(
            'fakticheskij_srok_dostavki' => $fakticheskij_srok_dostavki,
            'id_in_db' => $id_in_db
        ));
        //$line_array = $stmt->fetchAll();
        //array_push($res_array, 'fakticheskij_srok_dostavki'=>$fakticheskij_srok_dostavki);    
        break;
    
    case 'prostoj_chasy':
    case 'prostoj_stavka_za_ohrannika':
        $prostoj_chasy               = intval($line_array[0]['prostoj_chasy']);
        $prostoj_stavka_za_ohrannika = intval($line_array[0]['prostoj_stavka_za_ohrannika']);
        $prostoj_summa               = $prostoj_chasy * $prostoj_stavka_za_ohrannika * 2;
        
        $stmt = $pdo->prepare('UPDATE flights SET `prostoj_summa`=:prostoj_summa WHERE `id` = :id_in_db');
        $stmt->execute(array(
            'prostoj_summa' => $prostoj_summa,
            'id_in_db' => $id_in_db
        ));
        //$line_array = $stmt->fetchAll();
        //array_push($res_array, 'prostoj_summa'=>$prostoj_summa);
        $res_array["prostoj_summa"] = $prostoj_summa; // Это добавляет к массиву новый элемент с ключом "prostoj_summa"
        
        //От prostoj_summa зависит schet, так что пересчитываем его
        $stavka_bez_nds = intval($line_array[0]['stavka_bez_nds']);
        $stavka_s_nds   = intval($line_array[0]['stavka_s_nds']);
        $schet          = $prostoj_summa + $stavka_bez_nds + $stavka_s_nds;
        
        $stmt = $pdo->prepare('UPDATE flights SET `schet`=:schet WHERE `id` = :id_in_db');
        $stmt->execute(array(
            'schet' => $schet,
            'id_in_db' => $id_in_db
        ));
        //$line_array = $stmt->fetchAll();
        //array_push($res_array, 'schet'=>$schet);
        $res_array["schet"] = $schet; // Это добавляет к массиву новый элемент с ключом "schet"
        break;
    
    case 'arenda_mashin':
        $arenda_mashin = intval($line_array[0]['arenda_mashin']);
        $oplata_mashin = $arenda_mashin * 1700;
        
        $stmt = $pdo->prepare('UPDATE flights SET `oplata_mashin`=:oplata_mashin WHERE `id` = :id_in_db');
        $stmt->execute(array(
            'oplata_mashin' => $oplata_mashin,
            'id_in_db' => $id_in_db
        ));
        $res_array["oplata_mashin"] = $oplata_mashin; // Это добавляет к массиву новый элемент с ключом "schet"
        
        //От arenda_mashin зависит itogo, так что пересчитываем его
        $zp      = intval($line_array[0]['zp']);
        $prostoj = intval($line_array[0]['prostoj']);
        $itogo   = $zp + $prostoj + $oplata_mashin;
        
        $stmt = $pdo->prepare('UPDATE flights SET `itogo`=:itogo WHERE `id` = :id_in_db');
        $stmt->execute(array(
            'itogo' => $itogo,
            'id_in_db' => $id_in_db
        ));
        $res_array["itogo"] = $itogo; // Это добавляет к массиву новый элемент с ключом "schet"
        break;
    
    case 'zp':
    case 'prostoj':
    case 'oplata_mashin':
        $zp            = intval($line_array[0]['zp']);
        $prostoj       = intval($line_array[0]['prostoj']);
        $oplata_mashin = intval($line_array[0]['oplata_mashin']);
        $itogo         = $zp + $prostoj + $oplata_mashin;
        
        $stmt = $pdo->prepare('UPDATE flights SET `itogo`=:itogo WHERE `id` = :id_in_db');
        $stmt->execute(array(
            'itogo' => $itogo,
            'id_in_db' => $id_in_db
        ));
        $res_array["itogo"] = $itogo; // Это добавляет к массиву новый элемент с ключом "schet"
        
        $zp_plus_prostoj = $zp + $prostoj;
        $stmt            = $pdo->prepare('UPDATE flights SET `zp_plus_prostoj`=:zp_plus_prostoj WHERE `id` = :id_in_db');
        $stmt->execute(array(
            'zp_plus_prostoj' => $zp_plus_prostoj,
            'id_in_db' => $id_in_db
        ));
        $res_array["zp_plus_prostoj"] = $zp_plus_prostoj; // Это добавляет к массиву новый элемент с ключом "schet"            
        break;
    
    default:
        break;
}

header("Content-type: application/json; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
echo json_encode($res_array);
//echo "ok";
//echo $res[$y[]];
//echo json_encode($ar);
//echo json_encode(array('def0'=>$def0, 'def1'=>$def1, 'def2'=>$def2, 'def3'=>$def3, 'def4'=>$def4, 'sum'=>$sum));

?>