/*
 Скрипты для интерфейса менеджера
 */

 
//Ловим выбор месяца/года, чтобы сразу показать таблицу для этого периода
	//year  - выбранный селектора года
	//month - выбранный селектор месяца
$(function()	{ 
    var selected_year = document.getElementById("year");
    selected_year.onchange = function(){		
		show_flights_table();	
	}
}); 
$(function()	{ 
    var selected_month = document.getElementById("month");
	selected_month.onchange = function(){		
		show_flights_table();	
	}
}); 



//После полной загрузки страницы выполнить показ таблицы для залогиненного пользователя
window.onload=function(){
	$('#a_show_flights_table').trigger('click');
}	



//Показать таблицу рейсов менеджеру
function show_flights_table()
{		
	year = GetData('year');
	month = GetData('month');
	//console.log("период введён1: " + year + " " + month);
	
	ajax({
		url:"./core/php/show_flights_table.php",
		type:"POST",
		statbox:"status",
		data:
		{
			year:year,	
			month:month,
			//user_id:user_id,
		},
		success: function (data) {
			document.getElementById("status").innerHTML=''; //удалить значок ожидания
			//console.log(data);
			document.getElementById("div_flights_table").innerHTML=data;
		},
		error: function (error1) {
			console.log("eror_show_flights_table");
		}
	})	
}
window.show_flights_table = show_flights_table;



//Добавление строки в таблицу рейсов
function add_line()
{
	year = GetData('year');
	month = GetData('month');
	ajax({
			url:"./core/php/add_line_in_flights_table.php",
			type:"POST",
			//async: true,
			statbox:"status",
			data:
			{
				year:year,	
				month:month,
				//user_id:user_id,
			},
			success: function (data) {
				document.getElementById("status").innerHTML=''; //удалить значок ожидания
				//console.log(data);
				var SummDok = document.getElementById('div_flights_table'),
				SummSumm = data;
				SummDok.innerHTML = SummSumm;
                
                //show_flights_table();
			},
			error: function (error1) {
				console.log("eror_add_line"+" \n");
				//document.getElementById("write_time_status").innerHTML='<p>ОШИБКА!</p>';
			}
		})	
		
}
window.add_line = add_line;



//При клике по номеру строки, удалить её
function delete_line (id_line, table)
{
	//console.log("id_line="+id_line+" \n");
	year = GetData('year');
	month = GetData('month');	
	console.log(id_line+"_"+table+"_"+year+"_"+month);
	ajax({
			url:"./core/php/delete_line_in_flights_table.php",
			type:"POST",
			//async: true,
			statbox:"status",
			data:
			{
				id_line:id_line,	
				table:table,
				year:year,	
				month:month,
			},
			success: function (data) {
				document.getElementById("status").innerHTML=''; //удалить значок ожидания
				//console.log(data);
				var SummDok = document.getElementById('div_flights_table'),
				SummSumm = data;
				SummDok.innerHTML = SummSumm;
				if (table == '11') {			
					show_list_clients(); //Обновление списка клиентов	
				} else if (table == '10') {
					show_list_guards();	 //Обновление списка охранников		
				}
			},
			error: function (error1) {
				console.log("eror_delete_line");
				//document.getElementById("write_time_status").innerHTML='<p>ОШИБКА!</p>';
			}
		})	  
}
window.delete_line = delete_line;



//Функция, показывающая при клике по значку "Фото", фотографии, приаттаченные к рейсу
function get_photo(id_line) {
	ajax({
			url:"./core/php/get_photo.php",
			type:"POST",
			//async: true,
			statbox:"status",
			data:
			{
				id_line:id_line,	
			},
			success: function (data) {
				document.getElementById("status").innerHTML=''; //удалить значок ожидания
				var array_photo_flight = JSON.parse(data);
				//console.log(array_photo_flight);
				for (var i = 0; i < array_photo_flight.length; i++) {
					//console.log(array_photo_flight[i]);
					document.getElementById("thumbs").innerHTML=document.getElementById("thumbs").innerHTML + array_photo_flight[i];
					
					//Меняем большую картинку
					var patchLargeImg = document.getElementById('photo0');
					//console.log("patchLargeImg.src= " + patchLargeImg.src);
					var img = document.getElementById("largeImg"); 	// добываем ссылку на элемент (например, по id)
					//console.log("img.src= " + img.src);
					img.src = patchLargeImg.src; 				// а вот собственно замена
					
				}
					
				//Показываем модальное окно с данными выбранного рейса
				
				//$('#buy_button, #info-47, #text-form4').click( function(event){ // лoвим клик пo ссылки с id="go"
					//console.log("патаемся показать модальное окно фото");
					event.preventDefault(); // выключaем стaндaртную рoль элементa
					$('#overlay_for_photo').fadeIn(400, // снaчaлa плaвнo пoкaзывaем темную пoдлoжку
						function(){ // пoсле выпoлнения предыдущей aнимaции
							$('#modal_form_for_photo') 
								.css('display', 'block') // убирaем у мoдaльнoгo oкнa display: none;
								.animate({opacity: 1, top: '5%'}, 100); // плaвнo прибaвляем прoзрaчнoсть oднoвременнo сo съезжaнием вниз
					});
				//});
				/* Зaкрытие мoдaльнoгo oкнa, тут делaем тo же сaмoе нo в oбрaтнoм пoрядке */
				$('#modal_close_form_for_photo, #overlay_for_photo').click( function(){ // лoвим клик пo крестику или пoдлoжке
					$('#modal_form_for_photo')
						.animate({opacity: 0, top: '0%'}, 100,  // плaвнo меняем прoзрaчнoсть нa 0 и oднoвременнo двигaем oкнo вверх
							function(){ // пoсле aнимaции
								$(this).css('display', 'none'); // делaем ему display: none;
								$('#overlay_for_photo').fadeOut(400); // скрывaем пoдлoжку
							}
						);
						document.getElementById("thumbs").innerHTML=''; //очищаем модальное окно
				});

			},
			error: function (error1) {
				console.log("eror_delete_line");
				//document.getElementById("write_time_status").innerHTML='<p>ОШИБКА!</p>';
			}
		})	

}



// Переключение вкладок интерфейса менеджера при клике
 $(document).ready(function() { 	// вся мaгия пoсле зaгрузки стрaницы
	$('#page1').click( function(){ 	// лoвим клик 
		//console.log("Показать таблицу рейсов");
		$('#layerA').css('display', 'block'); 	// Показываем
		$('#layerB').css('display', 'none'); 	// Делaем невидимым		
		$('#clients').css('display', 'none'); 	// 
		//$('#page1').css('font-weight', 'bold'); 	// Подсвечиваем выбранную вкладку
	});
	$('#page2').click( function(){ // лoвим клик 
		//console.log("Показать список охранников");
		$('#layerA').css('display', 'none'); 	// 
		$('#layerB').css('display', 'block'); 	// 
		$('#clients').css('display', 'none'); 	// Показываем
		show_list_guards();
	});
	$('#page3').click( function(){ // лoвим клик 
		//console.log("Показать список охранников");
		$('#layerA').css('display', 'none'); 	// 
		$('#layerB').css('display', 'none'); 	// 
		$('#clients').css('display', 'block'); 	// Показываем
		show_list_clients()
	});
}); 
  
  

//Формирование и показ списка охранников
function show_list_guards(){	
	ajax({
			url:"./core/php/show_list_guards.php",
			type:"POST",
			statbox:"status",
			//data:
			//{
			//	nn_line:"какие-нибудь данные",	
			//},
			success: function (data) {
				document.getElementById("status").innerHTML=''; //удалить значок ожидания
				//console.log(data);
				document.getElementById("div_list_guards").innerHTML=data; //отобразить полученные данные
			},
			error: function (error1) {
				console.log("eror_delete_line");
				//document.getElementById("write_time_status").innerHTML='<p>ОШИБКА!</p>';
			}
		})	
}
  
  
  
//Регистрация охранника
function register(){
	var g_login 	= document.getElementById("login").value;
	var g_password 	= document.getElementById("password").value;
	var full_name 	= document.getElementById("full_name").value;
	//console.log(g_login+"_"+g_password+"_"+full_name);
	ajax({
			url:"./core/php/register.php",
			type:"POST",
			statbox:"status",
			data:
			{
				g_login:g_login,	
				g_password:g_password,	
				full_name:full_name,	
			},
			success: function (data) {
				document.getElementById("status").innerHTML=''; 	//удалить значок ожидания
				//console.log(data);

				var res = JSON.parse(data);
				if (res[1] != ""){									//Если есть ошибки, вывести их на экран
					document.getElementById("div_register_guard_error").innerHTML=res[1];
				} else {				
					document.getElementById("login").innerHTML='';	//Очистить поля ввода
					document.getElementById("password").innerHTML='';
					document.getElementById("full_name").innerHTML='';
					show_list_guards();
				}
			},
			error: function (error1) {
				console.log("eror_delete_line");
				//document.getElementById("write_time_status").innerHTML='<p>ОШИБКА регистрации!</p>';
			}
		})	
}



//Регистрация клиента
function register_client(){
	var client 	= document.getElementById("client").value;
	ajax({
			url:"./core/php/register_client.php",
			type:"POST",
			statbox:"status",
			data:
			{
				client:client,		
			},
			success: function (data) {
				document.getElementById("status").innerHTML=''; 	//удалить значок ожидания
				var res = JSON.parse(data);
				if (res[1] != ""){									//Если есть ошибки, вывести их на экран
					document.getElementById("div_register_client_error").innerHTML=res[1];
				} else {				
					document.getElementById("client").innerHTML='';	//Очистить поля ввода
					show_list_clients();
				}
			},
			error: function (error1) {
				console.log("eror_register_client");
			}
		})		
}

//Формирование и показ списка охранников
function show_list_clients(){	
	ajax({
			url:"./core/php/show_list_clients.php",
			type:"POST",
			statbox:"status",
			//data:
			//{
			//	nn_line:"9",	
			//},
			success: function (data) {
				document.getElementById("status").innerHTML=''; //удалить значок ожидания
				document.getElementById("div_list_clients").innerHTML=data; //отобразить полученные данные
			},
			error: function (error1) {
				console.log("eror_show_list_clients");
			}
		})	
}



//Подстановка фото в главный див при выборе миниатюры
function selectPhoto(){  
    var largeImg = document.getElementById('largeImg');
    var thumbs = document.getElementById('thumbs');
    thumbs.onclick = function(e) {
      var target = e.target;
      while (target != this) {
        if (target.nodeName == 'A') {
          showThumbnail(target.href, target.title);
          return false;
        }
        target = target.parentNode;
      }
    }
	
    function showThumbnail(href, title) {
      largeImg.src = href;
      largeImg.alt = title;
    }

    /* предзагрузка */
    var imgs = thumbs.getElementsByTagName('img');
    for (var i = 0; i < imgs.length; i++) {
      var url = imgs[i].parentNode.href;
      var img = document.createElement('img');
      img.src = url;
    }
}
