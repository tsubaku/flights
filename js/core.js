
/*
 Основная логика сервиса
 */

 
//<!-- AJAX блок -->
function XmlHttp()
{
	var xmlhttp;
	try{xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");}
	catch(e)
	{
		try {xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");} 
		catch (E) {xmlhttp = false;}
	}
	if (!xmlhttp && typeof XMLHttpRequest!='undefined')
	{
		xmlhttp = new XMLHttpRequest();
	}
	return xmlhttp;
}


function ajax(param)
{
	if (window.XMLHttpRequest) req = new XmlHttp();
	method=(!param.method ? "POST" : param.method.toUpperCase());

	if(method=="GET")
	{
		send=null;
		param.url=param.url+"&ajax=true";
	}
	else
	{
		send="";
		for (var i in param.data) send+= i+"="+param.data[i]+"&";
		// send=send+"ajax=true"; // если хотите передать сообщение об успехе
	}

	req.open(method, param.url, true);
	if(param.statbox)document.getElementById(param.statbox).innerHTML = '<img src="./img/wait.gif">';
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.send(send);
	req.onreadystatechange = function()
	{
		if (req.readyState == 4 && req.status == 200) //если ответ положительный
		{
			if(param.success)param.success(req.responseText);
		}
	}
}
//<!-- конец AJAX блока --> 
 
 


//Вспомогательная функция, берёт значение из списка http://e-javascript.ru/select.php?pp=10
function GetData(name_selector)
	{
		// получаем индекс выбранного элемента
		var selind = document.getElementById(name_selector).options.selectedIndex;
		var txt= document.getElementById(name_selector).options[selind].text; //Выбранный пункт списка
		var val= document.getElementById(name_selector).options[selind].value;//Его номер по порядку
		//alert("Теxt= "+ txt +" " + "Value= " + val);
		return txt;
	}

	
	



//Показать таблицу рейсов для user_id (Если это манагер - показать всё) //Используется только для показа таблицы менеджеру
function show_flights_table(user_id, date)
{		
	year = GetData('year');
	month = GetData('month');
	console.log("период введён1: " + year + " " + month);
	console.log("user_id1: "+ user_id + " \n");
	
	ajax({
		url:"./show_flights_table.php",
		type:"POST",
		statbox:"status",
		data:
		{
			year:year,	
			month:month,
			user_id:user_id,
		},
		success: function (data) {
			document.getElementById("status").innerHTML=''; //удалить значок ожидания
			console.log(data);
			document.getElementById("div_flights_table").innerHTML=data;
		},
		error: function (error1) {
			console.log("eror_show");
		}
	})	
}
window.show_flights_table = show_flights_table;



//Показать один рейс для охранника
function show_one_flight(date)
{		
	//year = GetData('year');
	//month = GetData('month');
	//console.log("период введён1: " + year + " " + month);
	//console.log("date: "+ date + " \n");
	//console.log("date: "+ date + " \n");
	ajax({
		url:"./show_one_flight.php",
		type:"POST",
		statbox:"status",
		data:
		{
			date:date,
			//year:year,	
			//month:month,
			user_id:user_id_current,
		},
		success: function (data) {
			document.getElementById("status").innerHTML=''; //удалить значок ожидания
			console.log(data);
			//document.getElementById("div_show_one_flight").innerHTML=data;
			var array_data_one_flight = JSON.parse(data);
			//console.log("# "+array_data_one_flight[0]);
			
			if (array_data_one_flight[2]){	//Время
				array_data_one_flight[2] = array_data_one_flight[2].replace(":00.000000","");
				//array_data_one_flight[2] = array_data_one_flight[2].substring(0, 10);
			}
			if (array_data_one_flight[7]){	//Приняте
				array_data_one_flight[7] = array_data_one_flight[7].replace(".000000","");
				array_data_one_flight[7] = array_data_one_flight[7].substring(0, 10)+"T"+array_data_one_flight[7].substring(11, 19);
			}
			if (array_data_one_flight[8]){	//Сдача
				array_data_one_flight[8] = array_data_one_flight[8].replace(".000000","");
				array_data_one_flight[8] = array_data_one_flight[8].substring(0, 10)+"T"+array_data_one_flight[8].substring(11, 19);
			}
			
			number_flight = array_data_one_flight[0];	//номер рейса
			document.getElementById("div_right_string0").innerHTML=array_data_one_flight[0];			
			document.getElementById("div_right_string1").innerHTML=array_data_one_flight[1];
			document.getElementById("div_right_string2").innerHTML=array_data_one_flight[2];			
			document.getElementById("div_right_string3").innerHTML=array_data_one_flight[3];			
			document.getElementById("div_right_string5").innerHTML=array_data_one_flight[5];			
			document.getElementById("div_right_string6").innerHTML=array_data_one_flight[6];			
			
			document.getElementById("div_right_string4").innerHTML="<input type='text' id='nomer_mashiny-"+array_data_one_flight[0]+"'name='nomer_mashiny-"+array_data_one_flight[0]+"' class='nomer_mashiny_mobi' value='"+array_data_one_flight[4]+"' onchange='change_cell(this.value, this.id)'></input>";	
			
			document.getElementById("div_right_string7").innerHTML="<input type='datetime-local' id='prinjatie-"+array_data_one_flight[0]+"'name='prinjatie-"+array_data_one_flight[0]+"' class='prinjatie_mobi' value='"+array_data_one_flight[7]+"' onchange='change_cell(this.value, this.id)'></input>";
			
			document.getElementById("div_right_string8").innerHTML="<input type='datetime-local' id='sdacha-"+array_data_one_flight[0]+"'name='sdacha-"+array_data_one_flight[0]+"' class='sdacha_mobi' value='"+array_data_one_flight[8]+"' onchange='change_cell(this.value, this.id)'></input>";
			
			//document.getElementById("div_right_string1").innerHTML=array_data_one_flight[1];
			//document.getElementById("div_right_string2").innerHTML=array_data_one_flight[2];
			//document.getElementById("div_right_string3").innerHTML=array_data_one_flight[3];
			//document.getElementById("div_right_string4").innerHTML=array_data_one_flight[4];

		},
		error: function (error1) {
			console.log("eror_show_one_flight");
		}
	})	
	
}
window.show_one_flight = show_one_flight;


// Запись изменённой ячейки (отправка её содержимого, column и id php-скрипту)
function change_cell(cell_value, cell_id)
{
	console.log("cell_value: "+cell_value+" cell_id: "+cell_id+" \n");
	var position_minus = cell_id.indexOf("-");		//найти позицию символа -
	var column_in_db = cell_id.substring(0, position_minus);//все символы до -, включительно (получаем название столбца в БД)
	var id_in_db = cell_id.substring(position_minus+1, cell_id.length);//все символы от - и до конца включительно (получаем id строки в БД)

	console.log("column_in_db: "+column_in_db+" \n");
	console.log("id_in_db: "+id_in_db+" \n");
	
	ajax({
			url:"./write_in_table.php",
			type:"POST",
			async: true,
			statbox:"status",
			data:
			{
				cell_value:cell_value,	
				id_in_db:id_in_db,
				column_in_db:column_in_db,
			},
			success: function (data) {
				document.getElementById("status").innerHTML=''; //удалить значок ожидания
				console.log(data);
				var changed_cells = JSON.parse(data);
				if ((column_in_db == 'prostoj_summa') || (column_in_db == 'stavka_bez_nds') || (column_in_db == 'stavka_s_nds')){
					console.log("refresh_cell");	
					var cell_adress = "schet-" + id_in_db;
					//console.log("schet= " + changed_cells.schet);		
					//console.log("cell_adress= " + cell_adress);
					//$(cell_adress).val(changed_cells.schet);
					document.getElementById(cell_adress).value = changed_cells.schet; //Обновляем ячейку "Счёт"
				}
				if ((column_in_db == 'prinjatie') || (column_in_db == 'sdacha')){
					console.log("!refresh cell fakticheskij_srok_dostavki");
					var cell_adress = "fakticheskij_srok_dostavki-" + id_in_db;
					console.log("fakticheskij_srok_dostavki= " + changed_cells.fakticheskij_srok_dostavki);		
					console.log("cell_adress= " + cell_adress);

					document.getElementById(cell_adress).value = changed_cells.fakticheskij_srok_dostavki; //Обновляем ячейку "fakticheskij_srok_dostavki"
				}
				if ((column_in_db == 'prostoj_chasy') || (column_in_db == 'prostoj_stavka_za_ohrannika')){
						
					var cell_adress = "prostoj_summa-" + id_in_db;
					console.log("prostoj_summa= " + changed_cells.prostoj_summa);
					document.getElementById(cell_adress).value = changed_cells.prostoj_summa; //Обновляем ячейку "prostoj_summa"
					
					var cell_adress2 = "schet-" + id_in_db;
					console.log("schet= " + changed_cells.schet);
					document.getElementById(cell_adress2).value = changed_cells.schet; //Обновляем ячейку "Счёт"
				}
				
				if (column_in_db == 'arenda_mashin'){
						
					var cell_adress = "oplata_mashin-" + id_in_db;
					console.log("oplata_mashin= " + changed_cells.oplata_mashin);
					document.getElementById(cell_adress).value = changed_cells.oplata_mashin; //Обновляем ячейку "oplata_mashin"
					
					var cell_adress = "itogo-" + id_in_db;
					console.log("itogo= " + changed_cells.itogo);
					document.getElementById(cell_adress).value = changed_cells.itogo; //Обновляем ячейку "itogo"
				}
				
				if ((column_in_db == 'zp') || (column_in_db == 'prostoj') || (column_in_db == 'oplata_mashin')){
						
					var cell_adress = "itogo-" + id_in_db;
					console.log("itogo= " + changed_cells.itogo);
					document.getElementById(cell_adress).value = changed_cells.itogo; //Обновляем ячейку "itogo"
					
					var cell_adress = "zp_plus_prostoj-" + id_in_db;
					console.log("zp_plus_prostoj= " + changed_cells.zp_plus_prostoj);
					document.getElementById(cell_adress).value = changed_cells.zp_plus_prostoj; //Обновляем ячейку "zp_plus_prostoj"
				}
			},
			error: function (error1) {
				console.log("eror_change_cell");
			}
		})	
}



//Добавление строки в таблицу рейсов
function add_line(user_id)
{
	year = GetData('year');
	month = GetData('month');
	ajax({
			url:"./add_line_in_flights_table.php",
			type:"POST",
			//async: true,
			statbox:"status",
			data:
			{
				year:year,	
				month:month,
				user_id:user_id,
			},
			success: function (data) {
				document.getElementById("status").innerHTML=''; //удалить значок ожидания
				console.log(data);
				var SummDok = document.getElementById('div_flights_table'),
				SummSumm = data;
				SummDok.innerHTML = SummSumm
			},
			error: function (error1) {
				console.log("eror_add_line"+" \n");
				//document.getElementById("write_time_status").innerHTML='<p>ОШИБКА! Отработанные часы НЕ записаны</p>';
			}
		})	
		
}
window.add_line = add_line;


//При клике по номеру строки, удалить её
function delete_line (nn_line, table)
{
	console.log("nn_line="+nn_line+" \n");
	year = GetData('year');
	month = GetData('month');	
	console.log(nn_line+"_"+table+"_"+year+"_"+month);
	ajax({
			url:"./delete_line_in_flights_table.php",
			type:"POST",
			//async: true,
			statbox:"status",
			data:
			{
				nn_line:nn_line,	
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
				
				show_list_guards();	 //Обновление списка охранников		
			},
			error: function (error1) {
				console.log("eror_delete_line");
				//document.getElementById("write_time_status").innerHTML='<p>ОШИБКА! Отработанные часы НЕ записаны</p>';
			}
		})	 
}
window.delete_line = delete_line;



//После полной загрузки страницы выполнить показ таблицы для залогиненного пользователя
window.onload=function(){
	$('#a_show_flights_table').trigger('click');
}	
	
	
//--------------------------
//Внешний вид и настройки календаря для выбора даты 
$(function(){
	//var array = ["2017-03-03","2017-03-04"];
	//console.log("выезды: "+window.array_date_of_departure);
	//console.log("выезды2: "+array_date_of_departure);
	
	$("#age").datepicker({
        inline: true,
		language: 'ru',
        changeYear: true,
        changeMonth: true,
		
		defaultDate:'0Y',
		minDate:'-3Y',
		maxDate:'+3Y',
		buttonImage:'../img/favicon.png', 
		showOn:'both', 
		buttonImageOnly:true,
		
		// Перед показом каждой даты - прогоняем ее по массиву событий, чтобы выставить свойства.
        // Свойств 3: вкл/выкл, класс оформления и текст, который вставляется в title элемента td.
		beforeShowDay: function(date) {
			//Берём число date в календаре и приводим к формату yy-mm-dd, а затем проверяем, есть ли оно в массиве array_date_of_departure
			if($.inArray($.datepicker.formatDate('yy-mm-dd', date ), array_date_of_departure) > -1) {
				return [true,"date_of_departure","available"];
			}
			else {
				return [false,"not_date_of_departure","not available"];
			}
		},
		// Что делать при клике по дате. https://habrahabr.ru/post/111155/
		onSelect: function(date) { 		//date - дата календаря, на которую нажали
			//console.log(date);
			show_one_flight(date); //Показать таблицу			
			
			//Показываем модальное окно с данными выбранного рейса
			event.preventDefault(); 	// выключaем стaндaртную рoль элементa
			$('#overlay').fadeIn(400, 	// снaчaлa плaвнo пoкaзывaем темную пoдлoжку
				function(){ 			// пoсле выпoлнения предыдущей aнимaции
					$('#modal_form') 
						.css('display', 'block') // убирaем у мoдaльнoгo oкнa display: none;
						.animate({opacity: 1}, 200); // плaвнo прибaвляем прoзрaчнoсть oднoвременнo сo съезжaнием вниз
			});

		   
			return false;
		},
	   
	   
    });
});


//--------------------------


//Модальное окно
$(document).ready(function() { // вся мaгия пoсле зaгрузки стрaницы
	//$('.date_of_departure').click( function(event){ // лoвим клик пo ссылке с id="date_of_departure"
	//	event.preventDefault(); // выключaем стaндaртную рoль элементa
	//	$('#overlay').fadeIn(400, // снaчaлa плaвнo пoкaзывaем темную пoдлoжку
	//	 	function(){ // пoсле выпoлнения предыдущей aнимaции
	//			$('#modal_form') 
	//				.css('display', 'block') // убирaем у мoдaльнoгo oкнa display: none;
	//				.animate({opacity: 1, top: '50%'}, 200); // плaвнo прибaвляем прoзрaчнoсть oднoвременнo сo съезжaнием вниз
	//	});
	//});
	/* Зaкрытие мoдaльнoгo oкнa, тут делaем тo же сaмoе нo в oбрaтнoм пoрядке */
	$('#modal_close, #overlay').click( function(){ // лoвим клик пo крестику или пoдлoжке
		$('#modal_form')
			.animate({opacity: 0, top: '0%'}, 200,  // плaвнo меняем прoзрaчнoсть нa 0 и oднoвременнo двигaем oкнo вверх
				function(){ // пoсле aнимaции
					$(this).css('display', 'none'); // делaем ему display: none;
					$('#overlay').fadeOut(400); // скрывaем пoдлoжку
					document.getElementById("div_right_string0").innerHTML='';	//Очистка полей модальнго окна рейсов		
					document.getElementById("div_right_string1").innerHTML='';
					document.getElementById("div_right_string2").innerHTML='';			
					document.getElementById("div_right_string3").innerHTML='';	
					document.getElementById("div_right_string4").innerHTML='';					
					document.getElementById("div_right_string5").innerHTML='';			
					document.getElementById("div_right_string6").innerHTML='';
					document.getElementById("div_right_string7").innerHTML='';			
					document.getElementById("div_right_string8").innerHTML='';
					ajax_respond.style.visibility='hidden';	//Скрываем ответ сервера
				}
			);
	});
});
//-----

//----- Скрипт загрузки файла ----- Автор: Тимур Камаев, http://wp-kama.ru/
function submitFile( jQuery ) {
(function($){
	// Глобальная переменная куда будут располагаться данные файлов. С ней будем работать	
	var files;

	// Вешаем функцию на событие
	$('input[type=file]').change(function(){
		ajax_respond.style.visibility='hidden';	//Скрываем ответ сервера
		files = this.files;	// Получим данные файлов и добавим их в переменную
		event.stopPropagation(); // Остановка происходящего
		event.preventDefault();  // Полная остановка происходящего

		// Создадим данные формы и добавим в них данные файлов из files
		var data1 = new FormData();
		$.each( files, function( key, value ){
			data1.append( key, value );
			//console.log("№ " + number_flight);
			data1.append("number_flight", number_flight);
		});
		//console.log(data1.getAll('number_flight'));

		// Отправляем запрос
		$.ajax({
			url: './submit.php?uploadfiles',
			type: 'POST',
			statbox:"status",
			data: data1,
			cache: false,
			dataType: 'json',	// тип загружаемых данных
			processData: false, // Не обрабатываем файлы (Don't process the files)
			contentType: false, // Так jQuery скажет серверу что это строковой запрос
			success: function( respond, textStatus, jqXHR ){
				document.getElementById("status").innerHTML=''; //удалить значок ожидания
				// Если все ОК
				if( typeof respond.error === 'undefined' ){
					// Файлы успешно загружены, делаем что-нибудь здесь

					// выведем пути к загруженным файлам в блок '.ajax-respond'
					//var files_path = respond.files;
					//var html = '';
					//$.each( files_path, function( key, val ){ html += val +'<br>'; } )
					//$('.ajax-respond').html( html );
					
				//	var html = "<img src='success.png' alt='OK' />";
				//	$('.ajax-respond').html( html );
					//document.getElementById("ajax-respond").innerHTML="";
					ajax_respond.style.visibility='visible'; //Показываем ответ сервера
					
				}
				else{
					console.log('ОШИБКИ ОТВЕТА сервера: ' + respond.error );
				}
			},
			error: function( jqXHR, textStatus, errorThrown ){
				console.log('ОШИБКИ AJAX запроса: ' + textStatus );
			}
		});
	});

	})(jQuery)
}	

$( document ).ready( submitFile );	//Запускаем ф-ию submitFile после полной зарузки страницы		
//---------------------------


//Функция, показывающая при клике по значку "Фото", фотографии, приаттаченные к рейсу
function get_photo(id_line) {
	ajax({
			url:"./get_photo.php",
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
					console.log(array_photo_flight[i]);
					document.getElementById("thumbs").innerHTML=document.getElementById("thumbs").innerHTML + array_photo_flight[i];
					
					//Меняем большую картинку
					var patchLargeImg = document.getElementById('photo0');
					console.log("patchLargeImg.src= " + patchLargeImg.src);
					var img = document.getElementById("largeImg"); 	// добываем ссылку на элемент (например, по id)
					console.log("img.src= " + img.src);
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
				//document.getElementById("write_time_status").innerHTML='<p>ОШИБКА! Отработанные часы НЕ записаны</p>';
			}
		})	
	
	
}

// Переключение вкладок интерфейса менеджера при клике
 $(document).ready(function() { 	// вся мaгия пoсле зaгрузки стрaницы
	$('#page1').click( function(){ 	// лoвим клик 
		//console.log("Показать таблицу рейсов");
		$('#layerB').css('display', 'none'); 	// делaем layerB невидимым: display: none;
		$('#layerA').css('display', 'block'); 	// Показываем layerA
	});
	$('#page2').click( function(){ // лoвим клик 
		//console.log("Показать список охранников");
		$('#layerA').css('display', 'none'); 	// 
		$('#layerB').css('display', 'block'); 	// 
		show_list_guards();
	});
}); 
  

//Формирование и показ списка охранников
function show_list_guards(){
	
	ajax({
			url:"./show_list_guards.php",
			type:"POST",
			statbox:"status",
			data:
			{
				nn_line:"9",	
			},
			success: function (data) {
				document.getElementById("status").innerHTML=''; //удалить значок ожидания
				//console.log(data);
				document.getElementById("div_list_guards").innerHTML=data; //отобразить полученные данные
			},
			error: function (error1) {
				console.log("eror_delete_line");
				//document.getElementById("write_time_status").innerHTML='<p>ОШИБКА! Отработанные часы НЕ записаны</p>';
			}
		})	

}
  
  
//Регистрация охранника
function register(){
	var g_login 	= document.getElementById("login").value;
	var g_password 	= document.getElementById("password").value;
	var full_name 	= document.getElementById("full_name").value;
	console.log(g_login+"_"+g_password+"_"+full_name);
	ajax({
			url:"./register.php",
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
				console.log(data);

				var res = JSON.parse(data);
				if (res[1] != ""){									//Если есть ошибки, вывести их на экран
					document.getElementById("div_from_register_error").innerHTML=res[1];
				} else {				
					document.getElementById("login").innerHTML='';	//Очистить поля ввода
					document.getElementById("password").innerHTML='';
					document.getElementById("full_name").innerHTML='';
					show_list_guards();
				}
			},
			error: function (error1) {
				console.log("eror_delete_line");
				//document.getElementById("write_time_status").innerHTML='<p>ОШИБКА! Отработанные часы НЕ записаны</p>';
			}
		})	
	
	
}


//Подстановка фото в главный див при выборе миниатюры
//https://learn.javascript.ru/task/image-gallery
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
