
// имя процесса, можно увидеть через команду top
process.title = 'casper-js-demo-artur';

var RP = global.RP = {

	Connections: {}

};

RP.Config = require('./Config/Config');

// подключаем модуль http сервера
var http = require('http');

var express = require('express');

var express_body_parser = require('body-parser');

var _ = global._ = require('underscore');

var logger = require('log4js');

// Подключаем модуль для работы с вебсокетом
var websocket = require('websocket');

require('./Classes/Service');

require('./Classes/Broadcast');

require('./Services/Grabber');

// подключаем более красивый логгер
RP.Logger = logger.getLogger();

//подключаем модуль для криптографии

RP.Crypto = require('crypto');

// создаем экземпдяр класс express
RP.Express = express();

// указываем где находяться все публичные файлы
RP.Express.use(express.static(__dirname + '/../Client/'));

/*RP.Express.use(function (err, req, res, next) {
	if (err) console.log(err);
  res.status(500).end(); // тут что-то делаем с ошибкой
});*/

RP.Express.use(express_body_parser.json());
//Подключаемся к базе данных

RP.Mongoose = require('mongoose');
RP.Mongoose.connect('mongodb://localhost/casper-js-demo-artur');

RP.Database = RP.Mongoose.connection;
RP.Database.on('error', console.error.bind(console, 'connection error:'));
RP.Database.once('open', function(){

	RP.Logger.debug('Connection to databases established');

	//Подключаемся наши модели данных
	require('./Services/Cache');
	require('./Services/Prices');

	
	Broadcast.call('Database Ready');

	RP.Grabber.run();

	Broadcast.on('Database Cache Ready', function(){

//Запускаем http сервер на порту 3000 для выдачи статического контента
		var http_server = http.createServer(RP.Express);

		http_server.listen(RP.Config.Port, function(){

			RP.Logger.debug("Express server listening on port "+RP.Config.Port);

			// Создаем объект WebSocket сервера
			var websocket_server = new websocket.server({

				httpServer: http_server
			});

			var cid = 1;

			websocket_server.on('request', function(request) {

				// уникальный id соединения
				var connnection_id = cid++;

				var ConnectionData = RP.Connections[connnection_id] = {
					ConnectionID: connnection_id,
					Connection: request.accept(null, request.origin)
				};

				RP.Logger.debug("Connection #"+connnection_id+" accepted");

				Broadcast.call('User Connected', [ConnectionData]);

				// реакция на посылку сообщения
				ConnectionData.Connection.on('message', function(message) {

					//принимаем только текст (JSON string)
					if(message.type == 'utf8') {

						// получаем объект
						var data = JSON.parse(message.utf8Data);
						if(!data) return;

						RP.Logger.debug("Received message from connection #"+connnection_id+": "+message.utf8Data);

						Broadcast.call('Client Data Received', [ConnectionData, data]);

					}
				});

				// реакция на отключение
				ConnectionData.Connection.on('close', function() {
					
					RP.Logger.debug("Connection #"+connnection_id+" closed.");

					Broadcast.call('User Disconnected', [ConnectionData]);

				});
			});
		});



	}, this);


});

RP.SendToConnection = function(connection_data, data) {

	RP.Logger.debug("Send to connection #"+connection_data.ConnectionID + ": ", data);

	connection_data.Connection.sendUTF(JSON.stringify(data));

};

RP.SendToAllConnection = function(data) {

	_.each(RP.Connections, function(connection_data){

		RP.SendToConnection(connection_data, data);

	}, this);
};

RP.SendHTTPResult = function(res, data){

	res.send(JSON.stringify(data));

}
