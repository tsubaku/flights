
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

	

// Запись изменённой ячейки (отправка её содержимого, column и id php-скрипту)
function change_cell(cell_value, cell_id)
{
	//console.log("cell_value: "+cell_value+" cell_id: "+cell_id+" \n");
	var position_minus = cell_id.indexOf("-");		//найти позицию символа -
	var column_in_db = cell_id.substring(0, position_minus);//все символы до -, включительно (получаем название столбца в БД)
	var id_in_db = cell_id.substring(position_minus+1, cell_id.length);//все символы от - и до конца включительно (получаем id строки в БД)

	//console.log("column_in_db: "+column_in_db+" \n");
	//console.log("id_in_db: "+id_in_db+" \n");
	
	ajax({
			url:"./core/php/write_in_table.php",
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
					//console.log("refresh_cell");	
					var cell_adress = "schet-" + id_in_db;
					document.getElementById(cell_adress).value = changed_cells.schet; //Обновляем ячейку "Счёт"
				}
				if ( ((column_in_db == 'prinjatie') || (column_in_db == 'sdacha')) && (user_id_current == 'manager') ){
					var cell_adress = "fakticheskij_srok_dostavki-" + id_in_db;		

					document.getElementById(cell_adress).value = changed_cells.fakticheskij_srok_dostavki; //Обновляем ячейку "fakticheskij_srok_dostavki"
				}
				if ((column_in_db == 'prostoj_chasy') || (column_in_db == 'prostoj_stavka_za_ohrannika')){
						
					var cell_adress = "prostoj_summa-" + id_in_db;
					document.getElementById(cell_adress).value = changed_cells.prostoj_summa; //Обновляем ячейку "prostoj_summa"
					
					var cell_adress2 = "schet-" + id_in_db;
					document.getElementById(cell_adress2).value = changed_cells.schet; //Обновляем ячейку "Счёт"
				}
				
				if (column_in_db == 'arenda_mashin'){
						
					var cell_adress = "oplata_mashin-" + id_in_db;
					document.getElementById(cell_adress).value = changed_cells.oplata_mashin; //Обновляем ячейку "oplata_mashin"
					
					var cell_adress = "itogo-" + id_in_db;
					document.getElementById(cell_adress).value = changed_cells.itogo; //Обновляем ячейку "itogo"
				}
				
				if ((column_in_db == 'zp') || (column_in_db == 'prostoj') || (column_in_db == 'oplata_mashin')){
						
					var cell_adress = "itogo-" + id_in_db;
					document.getElementById(cell_adress).value = changed_cells.itogo; //Обновляем ячейку "itogo"
					
					var cell_adress = "zp_plus_prostoj-" + id_in_db;
					document.getElementById(cell_adress).value = changed_cells.zp_plus_prostoj; //Обновляем ячейку "zp_plus_prostoj"
				}
			},
			error: function (error1) {
				console.log("eror_change_cell");
			}
		})	
}







  