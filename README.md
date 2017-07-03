## Synopsis

Сервис для учёта рейсов автоперевозок. Менеджер заносит в базу рейсы (заказчик, время отправления, стоимость, время простоя и т.д.) и распределяет, кому из охранников какой рейс достанется. После завершения рейса автоматически подсчитывается его цена, с учётом возможного простоя и неустоек. Охранник со своей стороны имеет возможность принять рейс в работу, ввести номер автомашины, время отправления и завершения рейса, а так же фотографии (экипажа и пломб).

## Code Example

---

## Motivation

Сервис сделан ради улучшения контроля за охраной грузов фирмой, осуществляющей услуги по охране. До его внедрения охранники перед выездом инструктировались устно, а при отправлении и по завершении рейса отзванивались дежурному, который вносил информацию в табель рейсов врчную. На основе этого табеля менеджер в экселе рассчитывал сроки доставки, неустойки и прочие финансы. Фиксация пломб на кузовах автотранспорта велась так же вручную. Сервис позволил автоматизировать эту работу.

## Installation

Скопировать файлы на хостинг, импортировать БД, переименовать config-example.ini в cofig.ini и задать в нём параметры доступа к БД: hostname, username, password, dbName.

## API Reference

---

## Tests

---

## Contributors

---

## Скриншоты

Интерфейс менеджера
![Интерфейс менеджера](img/scrinshots/Manager1.png)

Изменеие даты рейса
![Изменеие даты рейса](img/scrinshots/Manager2.png)

Список охранников
![Список охранников](img/scrinshots/Manager3.png)

Список фирм клиентов
![Список фирм клиентов](img/scrinshots/Manager4.png)

Галерея фотографий с рейса
![Галерея фотографий с рейса](img/scrinshots/Manager5.png)

Интерфейс охранника (выбор дня, на котором есть рейсы)
![Интерфейс охранника (выбор дня, на котором есть рейсы)](img/scrinshots/Guard1.png)

