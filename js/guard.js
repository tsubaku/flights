/*
 Скрипты для интерфейса охранника
 */

 

//Показать один рейс для охранника
function show_one_flight(date)
{		
	//console.log("период введён1: " + year + " " + month);
	console.log("date: "+ date + " \n");
	console.log("user_id_current: "+ user_id_current + " \n");
	ajax({
		url:"./core/php/show_one_flight.php",
		type:"POST",
		statbox:"status",
		data:
		{
			date:date,
			user_id:user_id_current,
		},
		success: function (data) {
			document.getElementById("status").innerHTML=''; //удалить значок ожидания
			console.log("data = "+data);
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


	
//--------------------------
//Внешний вид и настройки календаря для выбора даты 
$(function(){
	//var array = ["2017-03-03","2017-03-04"];
	//console.log("выезды: "+window.array_date_of_departure);
	//console.log("выезды2: "+array_date_of_departure);
	
	$("#calendar").datepicker({
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


//-------------------------


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


//----- Скрипт загрузки файла ----- 
function submitFile( jQuery ) {
(function($){
	var files;  // Глобальная переменная куда будут располагаться данные файлов. С ней будем работать

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
			url: './core/php/submit.php?uploadfiles',
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

