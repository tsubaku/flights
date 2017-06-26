
/*
 Всё, что относится к слайдерам
 */

//var defSlider0, defSlider1, defSlider2, defSlider3, defSlider4;
var defSlider0 = 0;
var defSlider1 = 0;
var defSlider2 = 0;
var defSlider3 = 0;
var defSlider4 = 0;
var valSlider0, valSlider1, valSlider2, valSlider3, valSlider4;
var sumSecondSliders = 0;

valSlider0 = jQuery("input#parameter0").val();			//Взять значение из инпута
valSlider1 = jQuery("input#parameter1").val();			
valSlider2 = jQuery("input#parameter2").val();			
valSlider3 = jQuery("input#parameter3").val();			
valSlider4 = jQuery("input#parameter4").val();			

var sum;
var dx0, dx1, dx2, dx3, dx4;


 
jQuery(document).ready(function(){

	//Забираем из хтмл статус оплаты заказа
	var order_status_field;
	orderStatus = jQuery("input#order_status_field").val();	//Взять значение из инпута	
	jQuery("input#qq").val(orderStatus);


	/* Главный слайдер */
	jQuery("#slider0").slider({
		min: 0,
		max: 400,
		value: defSlider0,
		orientation: "vertical",
		range: "min",
		stop: function(event, ui) {

			sum = jQuery("input#parameter6").val();				//Взять значение из инпута		
			valSlider0 = jQuery("#slider0").slider("value"); 	//Взять значение слайдера 0
			if(parseInt(valSlider0) > sum){
				valSlider0 = sum;
			};
			if(parseInt(valSlider0) < defSlider0){
				valSlider0 = defSlider0;
			};
			jQuery("#slider0").slider("value",valSlider0); 		//Установить слайдер
			
			valSlider1 = jQuery("#slider1").slider("value"); 	//Взять значение слайдера 1
			valSlider2 = jQuery("#slider2").slider("value"); 	//Взять значение слайдера 2
			valSlider3 = jQuery("#slider3").slider("value"); 	//Взять значение слайдера 3
			valSlider4 = jQuery("#slider4").slider("value"); 	//Взять значение слайдера 4
		
			dx0 = sum - valSlider0 - valSlider1 - valSlider2 - valSlider3 - valSlider4;
			if (orderStatus == 'ok'){
				dx1 = 0;
			}
			else{
				dx1 = dx0/4;
				buy_button.style.visibility='visible'; //Сделать видимым блок с предложением купить полную версию
			}
			
			valSlider1 = valSlider1 + dx1;
			if(valSlider1 > defSlider1){
				valSlider1 = defSlider1;
			};
			valSlider2 = valSlider2 + dx1;
			if(valSlider2 > defSlider2){
				valSlider2 = defSlider2;
			};
			valSlider3 = valSlider3 + dx1;
			if(valSlider3 > defSlider3){
				valSlider3 = defSlider3;
			};
			valSlider4 = valSlider4 + dx1;
			if(valSlider4 > defSlider4){
				valSlider4 = defSlider4;
			};
			
			jQuery("#slider1").slider("value",valSlider1); 	//Установить слайдеры
			jQuery("#slider2").slider("value",valSlider2); 	
			jQuery("#slider3").slider("value",valSlider3); 	
			jQuery("#slider4").slider("value",valSlider4); 	
				
			jQuery("input#parameter0").val(jQuery("#slider0").slider("value"));
			jQuery("input#parameter1").val(jQuery("#slider1").slider("value"));
			jQuery("input#parameter2").val(jQuery("#slider2").slider("value"));
			jQuery("input#parameter3").val(jQuery("#slider3").slider("value"));
			jQuery("input#parameter4").val(jQuery("#slider4").slider("value"));
			
		},
		
		slide: function(event, ui){
			//jQuery("input#parameter0").val(jQuery("#slider0").slider("value")); //вставить текущее значение слайдера в инпут
			
			sum = jQuery("input#parameter6").val();			//Взять значение из инпута
			//console.log('sum = ' + sum);
			
			valSlider0 = jQuery("#slider0").slider("value"); 	//Взять значение слайдера 0
			if(parseInt(valSlider0) > sum){
				valSlider0 = sum;
			};
			if(parseInt(valSlider0) < defSlider0){
				valSlider0 = defSlider0;
			};
			jQuery("#slider0").slider("value",valSlider0); 		//Установить слайдер
			
			valSlider1 = jQuery("#slider1").slider("value"); 	//Взять значение слайдеров
			valSlider2 = jQuery("#slider2").slider("value"); 	
			valSlider3 = jQuery("#slider3").slider("value"); 	
			valSlider4 = jQuery("#slider4").slider("value"); 	
		
			dx0 = sum - valSlider0 - valSlider1 - valSlider2 - valSlider3 - valSlider4;
			if (orderStatus == 'ok'){
				dx1 = 0;
			}
			else{
				dx1 = dx0/4;
			}
			
			valSlider1 = valSlider1 + dx1;
			if(valSlider1 > defSlider1){
				valSlider1 = defSlider1;
			};
			valSlider2 = valSlider2 + dx1;
			if(valSlider2 > defSlider2){
				valSlider2 = defSlider2;
			};
			valSlider3 = valSlider3 + dx1;
			if(valSlider3 > defSlider3){
				valSlider3 = defSlider3;
			};
			valSlider4 = valSlider4 + dx1;
			if(valSlider4 > defSlider4){
				valSlider4 = defSlider4;
			};
			
			jQuery("#slider1").slider("value",valSlider1); 	//Установить слайдеры
			jQuery("#slider2").slider("value",valSlider2); 
			jQuery("#slider3").slider("value",valSlider3); 	
			jQuery("#slider4").slider("value",valSlider4); 
				
			jQuery("input#parameter0").val(jQuery("#slider0").slider("value"));
			jQuery("input#parameter1").val(jQuery("#slider1").slider("value"));
			jQuery("input#parameter2").val(jQuery("#slider2").slider("value"));
			jQuery("input#parameter3").val(jQuery("#slider3").slider("value"));
			jQuery("input#parameter4").val(jQuery("#slider4").slider("value"));
		
		}
	});

	/* Дополнительные слайдеры */
	jQuery("#slider1").slider({
		min: 0,
		max: 100,
		value: defSlider1,
		orientation: "vertical",
		range: "min",
		stop: function(event, ui) {
			
			jQuery("input#parameter1").val(jQuery("#slider1").slider("value"));	
			
			//Ограничение максимального значения слайдера исходным значением
			valSlider1 = jQuery("#slider1").slider("value"); 	//Взять значение слайдера 1
			if(valSlider1 > defSlider1){
				valSlider1 = defSlider1;
			};
			jQuery("input#parameter1").val(valSlider1);		//Установить поле инпута
			jQuery("#slider1").slider("value",valSlider1); 	//Установить слайдер
			
			valSlider0 = jQuery("#slider0").slider("value"); 	//Взять значение слайдера 0			
			valSlider2 = jQuery("#slider2").slider("value"); 	//Взять значение слайдера 2
			valSlider3 = jQuery("#slider3").slider("value"); 	//Взять значение слайдера 3
			valSlider4 = jQuery("#slider4").slider("value"); 	//Взять значение слайдера 4
			
			dx1 = sum - valSlider0 - valSlider1 - valSlider2 - valSlider3 - valSlider4;
			dx0 = dx1;
			valSlider0 = valSlider0 + dx0;
			jQuery("#slider0").slider("value",valSlider0); 	//Установить слайдер 0
			jQuery("input#parameter0").val(valSlider0);		//Установить его инпут		
			
			buy_button.style.visibility='visible'; //Сделать видимым блок с предложением купить полную версию
		},
		
		slide: function(event, ui){
			sum = jQuery("input#parameter6").val();			//Взять значение из инпута
			
			jQuery("input#parameter1").val(jQuery("#slider1").slider("value"));
			
			valSlider0 = jQuery("#slider0").slider("value"); 	//Взять значение слайдера 0
			valSlider1 = jQuery("#slider1").slider("value"); 	//Взять значение слайдера 1
			valSlider2 = jQuery("#slider2").slider("value"); 	//Взять значение слайдера 2
			valSlider3 = jQuery("#slider3").slider("value"); 	//Взять значение слайдера 3
			valSlider4 = jQuery("#slider4").slider("value"); 	//Взять значение слайдера 4
			
			dx1 = sum - valSlider0 - valSlider1 - valSlider2 - valSlider3 - valSlider4;
			dx0 = dx1;
			valSlider0 = valSlider0 + dx0;
			jQuery("#slider0").slider("value",valSlider0); 	//Установить слайдер 0
			jQuery("input#parameter0").val(valSlider0);		//Установить его инпут
		}
	});

	jQuery("#slider2").slider({
		min: 0,
		max: 100,
		value: defSlider2,
		orientation: "vertical",
		range: "min",
		stop: function(event, ui) {
			jQuery("input#parameter2").val(jQuery("#slider2").slider("value"));	

			//Ограничение максимального значения слайдера исходным значением
			valSlider2 = jQuery("#slider2").slider("value"); 	//Взять значение слайдера 1
			if(valSlider2 > defSlider2){
				valSlider2 = defSlider2;
			};
			jQuery("input#parameter2").val(valSlider2);		//Установить поле инпута
			jQuery("#slider2").slider("value",valSlider2); 	//Установить слайдер
			
			valSlider0 = jQuery("#slider0").slider("value"); 	//Взять значение слайдера 0			
			valSlider1 = jQuery("#slider1").slider("value"); 	//Взять значение слайдера 1
			valSlider3 = jQuery("#slider3").slider("value"); 	//Взять значение слайдера 3
			valSlider4 = jQuery("#slider4").slider("value"); 	//Взять значение слайдера 4
			
			dx2 = sum - valSlider0 - valSlider1 - valSlider2 - valSlider3 - valSlider4;
			dx0 = dx2;
			valSlider0 = valSlider0 + dx0;
			jQuery("#slider0").slider("value",valSlider0); 	//Установить слайдер 0
			jQuery("input#parameter0").val(valSlider0);		//Установить его инпут		
			
			buy_button.style.visibility='visible'; //Сделать видимым блок с предложением купить полную версию
		},
		
		slide: function(event, ui){
			sum = jQuery("input#parameter6").val();			//Взять значение из инпута
			jQuery("input#parameter2").val(jQuery("#slider2").slider("value"));
			
			valSlider0 = jQuery("#slider0").slider("value"); 	//Взять значение слайдера 0
			valSlider1 = jQuery("#slider1").slider("value"); 	//Взять значение слайдера 1
			valSlider2 = jQuery("#slider2").slider("value"); 	//Взять значение слайдера 2
			valSlider3 = jQuery("#slider3").slider("value"); 	//Взять значение слайдера 3
			valSlider4 = jQuery("#slider4").slider("value"); 	//Взять значение слайдера 4
					
			dx2 = sum - valSlider0 - valSlider1 - valSlider2 - valSlider3 - valSlider4;
			dx0 = dx2;
			valSlider0 = valSlider0 + dx0;
			jQuery("#slider0").slider("value",valSlider0); 	//Установить слайдер 0
			jQuery("input#parameter0").val(valSlider0);		//Установить его инпут
		}
	});

	jQuery("#slider3").slider({
		min: 0,
		max: 100,
		value: defSlider3,
		orientation: "vertical",
		range: "min",
		//create: function(event, ui){
		//	defSlider3=jQuery("input#age").val();	//Взять значение из инпута возраста
		//	jQuery("input#parameter3").val(defSlider3);		//Установить точное значение поле инпута 3
		//},
		stop: function(event, ui) {
			jQuery("input#parameter3").val(jQuery("#slider3").slider("value"));	

			//Ограничение максимального значения слайдера исходным значением
			valSlider3 = jQuery("#slider3").slider("value"); 	//Взять значение слайдера 1
			if(valSlider3 > defSlider3){
				valSlider3 = defSlider3;
			};
			jQuery("input#parameter3").val(valSlider3);		//Установить поле инпута
			jQuery("#slider3").slider("value",valSlider3); 	//Установить слайдер
			
			valSlider0 = jQuery("#slider0").slider("value"); 	//Взять значение слайдера 0			
			valSlider1 = jQuery("#slider1").slider("value"); 	//Взять значение слайдера 1
			valSlider2 = jQuery("#slider2").slider("value"); 	//Взять значение слайдера 3
			valSlider4 = jQuery("#slider4").slider("value"); 	//Взять значение слайдера 4
			
			dx3 = sum - valSlider0 - valSlider1 - valSlider2 - valSlider3 - valSlider4;
			dx0 = dx3;
			valSlider0 = valSlider0 + dx0;
			jQuery("#slider0").slider("value",valSlider0); 	//Установить слайдер 0
			jQuery("input#parameter0").val(valSlider0);		//Установить его инпут		
			
			buy_button.style.visibility='visible'; //Сделать видимым блок с предложением купить полную версию
			
		},
		
		slide: function(event, ui){
			sum = jQuery("input#parameter6").val();			//Взять значение из инпута
			jQuery("input#parameter3").val(jQuery("#slider3").slider("value"));
			
			valSlider0 = jQuery("#slider0").slider("value"); 	//Взять значение слайдера 0
			valSlider1 = jQuery("#slider1").slider("value"); 	//Взять значение слайдера 1
			valSlider2 = jQuery("#slider2").slider("value"); 	//Взять значение слайдера 2
			valSlider3 = jQuery("#slider3").slider("value"); 	//Взять значение слайдера 3
			valSlider4 = jQuery("#slider4").slider("value"); 	//Взять значение слайдера 4
			
			dx3 = sum - valSlider0 - valSlider1 - valSlider2 - valSlider3 - valSlider4;
			dx0 = dx3;
			valSlider0 = valSlider0 + dx0;
			jQuery("#slider0").slider("value",valSlider0); 	//Установить слайдер 0
			jQuery("input#parameter0").val(valSlider0);		//Установить его инпут
		}
	});
	
	jQuery("#slider4").slider({
		min: 0,
		max: 100,
		value: defSlider4,
		orientation: "vertical",
		range: "min",
		stop: function(event, ui) {
			jQuery("input#parameter4").val(jQuery("#slider4").slider("value"));	

			//Ограничение максимального значения слайдера исходным значением
			valSlider4 = jQuery("#slider4").slider("value"); 	//Взять значение слайдера 1
			if(valSlider4 > defSlider4){
				valSlider4 = defSlider4;
			};
			jQuery("input#parameter4").val(valSlider4);		//Установить поле инпута
			jQuery("#slider4").slider("value",valSlider4); 	//Установить слайдер
			
			valSlider0 = jQuery("#slider0").slider("value"); 	//Взять значение слайдера 0			
			valSlider1 = jQuery("#slider1").slider("value"); 	//Взять значение слайдера 1
			valSlider2 = jQuery("#slider2").slider("value"); 	//Взять значение слайдера 3
			valSlider3 = jQuery("#slider3").slider("value"); 	//Взять значение слайдера 4
			
			dx3 = sum - valSlider0 - valSlider1 - valSlider2 - valSlider3 - valSlider4;
			dx0 = dx3;
			valSlider0 = valSlider0 + dx0;
			jQuery("#slider0").slider("value",valSlider0); 	//Установить слайдер 0
			jQuery("input#parameter0").val(valSlider0);		//Установить его инпут		
			
			buy_button.style.visibility='visible'; //Сделать видимым блок с предложением купить полную версию
		},
		slide: function(event, ui){
			sum = jQuery("input#parameter6").val();			//Взять значение из инпута
			jQuery("input#parameter4").val(jQuery("#slider4").slider("value"));
			
			valSlider0 = jQuery("#slider0").slider("value"); 	//Взять значение слайдера 0
			valSlider1 = jQuery("#slider1").slider("value"); 	//Взять значение слайдера 1
			valSlider2 = jQuery("#slider2").slider("value"); 	//Взять значение слайдера 2
			valSlider3 = jQuery("#slider3").slider("value"); 	//Взять значение слайдера 3
			valSlider4 = jQuery("#slider4").slider("value"); 	//Взять значение слайдера 4
			
			dx4 = sum - valSlider0 - valSlider1 - valSlider2 - valSlider3 - valSlider4;
			dx0 = dx4;
			valSlider0 = valSlider0 + dx0;
			jQuery("#slider0").slider("value",valSlider0); 	//Установить слайдер 0
			jQuery("input#parameter0").val(valSlider0);		//Установить его инпут
		}
	});


	//Обратная связь между инпутами и слайдерами
	jQuery("input#parameter0").change(function(){
		valSlider0 = jQuery("input#parameter0").val();
		jQuery("#slider0").slider("value", valSlider0);	
	});
	jQuery("input#parameter1").change(function(){
		valSlider1 = jQuery("input#parameter1").val();
		jQuery("#slider1").slider("value", valSlider1);	
	});
	jQuery("input#parameter2").change(function(){
		valSlider2 = jQuery("input#parameter2").val();
		jQuery("#slider2").slider("value", valSlider2);	
	});
	jQuery("input#parameter3").change(function(){
		valSlider3 = jQuery("input#parameter3").val();
		jQuery("#slider3").slider("value", valSlider3);	
	});
	jQuery("input#parameter4").change(function(){
		valSlider4 = jQuery("input#parameter4").val();
		jQuery("#slider4").slider("value", valSlider4);	
	});
	



});



