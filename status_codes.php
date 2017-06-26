<html xmlns="http://www.w3.org/1999/xhtml">
<html>
	<head>
		<title>Авторизация</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta charset="UTF-8" />		
		<meta http-equiv="Cache-control" content="NO-CACHE">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">		
		<link rel="stylesheet" href="main.css">
    </head>
    <body>
		<?  
			if (isset($_GET['result'])){			
				switch ($_GET['result']){
					case 401:
						print '401 Access allowed only for registered users. <br>';
						print 'Доступ запрещён. Пройдите <a href="login.php">авторизацию</a>. Если автоизация пройдена, возможно у вас выключены куки.';
						break;
						
					case 402:
						print 'Неизвестная ошибка авторизации  <br>';
						setcookie("id", "", time() - 3600*24*30*12, "/");
						setcookie("hash", "", time() - 3600*24*30*12, "/");
						print "<br> Хм, что-то не получилось <br>";
						//print "cookie hash: ".$_COOKIE['hash']."   user hash: ".$userdata['user_hash']." <br>";
						//print "cookie id: ".$_COOKIE['id']."   user id: ".$userdata['user_id']." <br>";
						//print "cookie ip: ".$_SERVER['REMOTE_ADDR']."   user ip: ".$userdata['user_ip']." <br>";
						print 'Пройдите <a href="login.php">авторизацию</a>. Если автоизация пройдена, возможно у вас выключены куки. <br>';		
						print '402 <br>';
						
						break;	
						
					case 403:					
						print '403 <br>';
						print 'Доступ к этой странице только у менеджера. Пройдите <a href="login.php">авторизацию</a>.<br>';
						break;
						
					default:
						print 'Неизвестная ошибка авторизации';
				}						
			}
		?>
	</body>		
</html>