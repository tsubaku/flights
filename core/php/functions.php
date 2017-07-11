<?php
//Файл с набором функций для программы.

//Показать таблицу рейсов за введённый период
function showTable($year, $month)
{
    $table = '20'; //рейсы             !!! Костыль !!!
    
    #Перевод названия месяца в его номер по порядку
    $mons       = array(
        "Январь" => 01,
        "Февраль" => 02,
        "Март" => 03,
        "Апрель" => 04,
        "Май" => 05,
        "Июнь" => 06,
        "Июль" => 07,
        "Август" => 08,
        "Сентябрь" => 09,
        "Октябрь" => 10,
        "Ноябрь" => 11,
        "Январь" => 12
    );
    $month_name = $mons[$month];
    
    $ru_rows_array = array(
            "№",
            "Номер рейса",
            "Дата выезда",
            "Время",
            "Клиент",
            "Подклиент",
            "Номер машины",
            "Принятие под охрану",
            "Сдача с охраны",
            "Состав ОХР",
            "ФИО",
            "Выдано",
            "Машина",
            "Срок доставки",
            "Принятие",
            "Сдача",
            "Фактич. срок доставки",
            "Простой часы",
            "Простой, ставка за охранника",
            "Простой сумма",
            "Ставка без НДС",
            "Ставка с НДС",
            "Счёт",
            "ЗП",
            "Простой",
            "Аренда машины",
            "Оплата машины",
            "ИТОГО",
            "ЗП+Простой",
            "Статус"
        );
        
    #Вытаскаваем из базы все данные всех рейсов за указанный период.
    $pdo = connectToBase();
    $stmt        = $pdo->prepare('SELECT * FROM `flights` WHERE (data_vyezda BETWEEN :data_from AND :data_before) OR `data_vyezda` IS NULL GROUP BY `id`');
    $data_from   = "$year" . "-" . "$month_name" . "-01";
    $data_before = "$year" . "-" . "$month_name" . "-31";
    $stmt->execute(array(
        'data_from' => $data_from,
        'data_before' => $data_before
    ));
    $table_array = $stmt->fetchAll(); //Обработать запрос, переведя ВСЕ данные в массив $table_array
    //print_r($table_array[0]);
    //print_r($table_array[1]['vremja']);
    
    #Вытаскиваем все фамилии охранников
    $stmt = $pdo->query('SELECT `full_name` FROM `users`'); //   
    $users_array = array(); //Массив фамилий зарегистрированных охранников
    $k           = 0;
    while ($row = $stmt->fetch()) {
        if ($row['full_name'] != 'Менеджер') {
            $users_array[$k] = $row['full_name'];
            $k               = $k + 1;
        }
    }
    $users_array[$k] = 'Не выбран'; //Добавляем в массив охранников невыбранного
    
    #Вытаскиваем всех клиентов
    $stmt         = $pdo->query('SELECT `client` FROM `clients`'); //
    $client_array = array(); //Массив фамилий зарегистрированных клиентов
    $k            = 0;
    while ($row = $stmt->fetch()) {
        $client_array[$k] = $row['client'];
        $k                = $k + 1;
    }
    $client_array[$k] = 'Не выбран'; //Добавляем в массив невыбранного клиента
    
    #Рисуем таблицу рейсов
    if ($table_array != NULL) { //иначе варнинги идут, если рейсов нет
        
        #Рисуем таблицу
        echo "<table>";
        echo "<caption><strong>Рейсы за $month $year</strong></caption>"; //Название таблицы
        
        #Рисуем шапку таблицы
        echo "<tr>";
        foreach ($ru_rows_array as $key => $value) {
            echo "<td><strong>" . $value . "</strong></td>"; 
        } 
        echo "</tr>";
        
        #Рисуем строки таблицы
        $js_change_cell = "change_cell(this.value, this.id)"; //Ф-ия записи данных в ячейке при их изменении
        $js_change_list = "change_cell(GetData(this.id), this.id)"; //Ф-ия записи данных в селекте при их изменении
        foreach ($table_array as $key_id => $row_content) { //$key_id - номер строки в таблице, $row_content - массив ячеек в ряду
            echo "<tr>";
            echo "<td><input type='text' id='number_line$key_id' value='" . $key_id . "' disabled='disabled'> </input></td>"; //Вывод № строки
            $id_line   = $row_content['id']; //$id_line - id строки в БД
            $id_status = $row_content['fakticheskij_srok_dostavki']; //$id_status - status строки в БД
            foreach ($row_content as $column_name => $data) {
                
                //Определяем переменные для каждой ячейки строки
                $button       = "";
                $photo        = "";
                $container    = "container_default";
                $status_class = "";
                $readonly     = "";
                $type         = "text";
                $fio          = "";
                switch ($column_name) {
                    case 'id':
                        #Вытаскиваем все пути к фотографиям рейса
                        $stmt = $pdo->prepare('SELECT `path` FROM `photo` WHERE `n_flight` = :id_line');
                        $stmt->execute(array(
                            'id_line' => $id_line
                        ));
                        $photo_name_array = $stmt->fetchAll(); //Обработать запрос, переведя ВСЕ данные в массив $photo_name_array
                        if ($photo_name_array) { //Если имеется хотя бы одно фото
                            $photo = "<button type='button' class='a_button_photo' onclick='get_photo($id_line)'></button>";
                        } else {
                            $photo = "<button type='button' class='a_button_no_photo' onclick='get_photo($id_line)'></button>";
                        }
                        $container = "container_id";
                        $button    = "<button type='button' class='a_button_delete' onclick='delete_line($data, $table);'></button>";
                        break;
                    
                    case 'data_vyezda':
                        $type = "date"; //Ставим в ячейку дату;
                        break;
                    
                    case 'vremja':
                    case 'srok_dostavki':
                        $type = "text";
                        $data = substr($data, 0, 5); //убираем лишнее из формата ячейки TIME
                        break;
                    
                    case 'prinjatie':
                    case 'sdacha':
                        $type = "datetime-local"; //Ставим в ячейку тип "дата и время"
                        if (isset($data)) { //хз как, но оно работает, но время показывается и прописывается правильно
                            $data = date("Y-m-d\TH:i:s", strtotime($data));
                        }
                        $input_class = '';
                        break;
                    
                    case 'klient':
                        $klient = "<select size='0' id='klient-$id_line' name='klient-$id_line' class='list_users' onchange='$js_change_list'>";
                        foreach ($client_array as $value) {
                            $user_n = str_replace(" ", "_", $value); //Заменяем пробелы на _, иначе браузер не понимает
                            $klient .= "<option value=$user_n";
                            if (($value == $data) or ($data == NULL)) {
                                $klient .= " selected='selected'";
                            }
                            $klient .= '>' . $value;
                        }
                        $klient .= "</select>";
                        break;
                    
                    case 'fio':
                        $fio = "<select size='0' id='fio-$id_line' name='fio-$id_line' class='list_users' onchange='$js_change_list'>";
                        foreach ($users_array as $value) {
                            $user_n = str_replace(" ", "_", $value); //Заменяем пробелы на _, иначе браузер не понимает
                            $fio .= "<option value=$user_n";
                            if (($value == $data) or ($data == NULL)) {
                                $fio .= " selected='selected'";
                            }
                            $fio .= '>' . $value;
                        }
                        $fio .= "</select>";
                        break;
                    
                    case 'fakticheskij_srok_dostavki':
                    case 'prostoj_summa':
                    case 'schet':
                    case 'oplata_mashin':
                    case 'itogo':
                    case 'zp_plus_prostoj':
                        $readonly = "readonly";
                        break;
                    
                    default:
                        break;
                }
                if ($id_status == 'В рейсе') {
                    $status_class = 'completed';
                }
                
                //Если столбец ФИО или Клиент, то рисуем тег select со списком, иначе просто 
                if ($column_name == 'fio') {
                    echo "<td ><div class='$container'>$fio</div></td>"; //
                } else if ($column_name == 'klient') {
                    echo "<td ><div class='$container'>$klient</div></td>"; //
                } else {
                    echo "<td ><div class='$container'>$photo<input $readonly type='$type' id='$column_name-$id_line' name='$column_name-$id_line' class='$column_name $status_class' value='$data' onchange='$js_change_cell'></input>$button</div></td>"; //
                }
            }
            echo "</tr>";
        }
        echo "</table>";
    } else { //Если в таблице нет ни одного рейса за этот месяц и нет рейсов без даты, то:
        $stmt = $pdo->query('INSERT INTO flights () VALUES()'); //Добавляем пустую строку
        showTable($year, $month_name); //Заново запускаем функцию и выводим эту строку на экран
    }
    unset($row_content); // разорвать ссылку на последний элемент

}


//Ресайз фотографий после загрузки на сервер для создания миниатюр
function createThumbnail($path, $save, $width, $height)
{
    $info = getimagesize($path); //получаем размеры картинки и ее тип
    if ($info == false) {   //проверка существования данных о возвращаемых getimagesize данных фото.
        return false;
    }
    $size = array(
        $info[0],
        $info[1]
    ); //закидываем размеры в массив
    
    //В зависимости от расширения картинки вызываем соответствующую функцию
    if ($info['mime'] == 'image/png') {
        $src = imagecreatefrompng($path); //создаём новое изображение из файла
    } else if ($info['mime'] == 'image/jpeg') {
        $src = imagecreatefromjpeg($path);
    } else if ($info['mime'] == 'image/gif') {
        $src = imagecreatefromgif($path);
    } else {
        return false;
    }
    
    $thumb        = imagecreatetruecolor($width, $height); //возвращает идентификатор изображения, представляющий черное изображение заданного размера
    $src_aspect   = $size[0] / $size[1]; //отношение ширины к высоте исходника
    $thumb_aspect = $width / $height; //отношение ширины к высоте аватарки
    
    if ($src_aspect < $thumb_aspect) { //узкий вариант (фиксированная ширина)      $scale = $width / $size[0];         $new_size = array($width, $width / $src_aspect);        $src_pos = array(0, ($size[1] * $scale - $height) / $scale / 2); //Ищем расстояние по высоте от края картинки до начала картины после обрезки   } else if ($src_aspect > $thumb_aspect) {
        //широкий вариант (фиксированная высота)
        $scale    = $height / $size[1];
        $new_size = array(
            $height * $src_aspect,
            $height
        );
        $src_pos  = array(
            ($size[0] * $scale - $width) / $scale / 2,
            0
        ); //Ищем расстояние по ширине от края картинки до начала картины после обрезки
    } else {
        //другое
        $new_size = array(
            $width,
            $height
        );
        $src_pos  = array(
            0,
            0
        );
    }
    
    $new_size[0] = max($new_size[0], 1);
    $new_size[1] = max($new_size[1], 1);
    
    imagecopyresampled($thumb, $src, 0, 0, $src_pos[0], $src_pos[1], $new_size[0], $new_size[1], $size[0], $size[1]);
    //Копирование и изменение размера изображения с ресемплированием   
    if ($save === false) {
        return imagepng($thumb); //Выводит JPEG/PNG/GIF изображение
    } else {
        return imagepng($thumb, $save); //Сохраняет JPEG/PNG/GIF изображение
    }  
}


# Функция для генерации случайной строки (для авторизации, испоьзуется в login.php)
function generateCode($length = 6)
{
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHI JKLMNOPRQSTUVWXYZ0123456789";
    $code  = "";
    $clen  = strlen($chars) - 1;
    while (strlen($code) < $length) {
        $code .= $chars[mt_rand(0, $clen)];
    }
    return $code;
}


# Функция чтения конфига из файла
function readConfig($file)
{
    return parse_ini_file($file);
}


# Соединение с БД
function connectToBase()
{
    # Читаем конфиг
    $connect_conf = readConfig('config.ini'); // Получаем все параметры без разделов
    $hostname     = $connect_conf[hostname];
    $username     = $connect_conf[username];
    $password     = $connect_conf[password];
    $dbName       = $connect_conf[dbName];
    $charset      = $connect_conf[charset];
    
    # Cоздать соединение
    $dsn = "mysql:host=$hostname;dbname=$dbName;charset=$charset";
    $opt = array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
    );
    $pdo = new PDO($dsn, $username, $password, $opt);
    
    return $pdo;
}


# Функция проверки авторизации
function verifyAuthorization($level)
{
    if (empty($_COOKIE['id']) or empty($_COOKIE['hash'])) {
        # Переадресовываем браузер на страницу ошибок авторизации (нет хеша или куков)
        //header("Location: status_codes.php?result=401"); exit();
        header("Location: login.php");
        exit(); //А неавтизованным - страница входа
    }
    
    # Cоздать соединение
    $pdo = connectToBase();
    
    //Подготовить переменные и выполнить запрос к базе
    $stmt      = $pdo->prepare('SELECT *,INET_NTOA(user_ip) FROM users WHERE user_id = :cookie_id LIMIT 1');
    $cookie_id = intval($_COOKIE['id']);
    $stmt->execute(array(
        'cookie_id' => $cookie_id
    ));
    $userdata = $stmt->Fetch();
    
    if (($userdata['user_hash'] !== $_COOKIE['hash']) or ($userdata['user_id'] !== $_COOKIE['id'])) {
        # Переадресовываем браузер на страницу ошибок авторизации (не совпадает хеш или куки)
        //header("Location: status_codes.php?result=402");
         header("Location: login.php");
        exit();
    }
     
    if ($level == 'manager') { #Доп.проверка для менеджерского аккаунта
        if ($userdata['user_id'] !== '9') {
            # Переадресовываем браузер на страницу ошибок авторизации (не совпадает хеш или куки)
            //header("Location: status_codes.php?result=403");
             header("Location: login.php");
            exit();
        }
    }
    $user_info  = array(
            user_id    => $userdata['user_id'],   //id юзера
            full_name  => $userdata['full_name'], //Фамилия юзера
            user_level => $userdata['user_level'] //Подтверждённый юзерлевел
        );
        
    //$user_level = $userdata['user_id']; //Подтверждённый юзерлевел 
    return $user_info;
}

?>