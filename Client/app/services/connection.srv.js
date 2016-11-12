angular.module('redprice').service('ConnectionSrv', ['$rootScope', function($rootScope) {

	var _this = this;

	this.connect = function(main_scope) {

		var socket = this.Socket = new WebSocket('ws://localhost:3001');
		//var socket = this.Socket = new WebSocket('ws://5.45.119.19:3001');
		socket.onopen = function() {

			console.info("# Web Socket: connection established");

		};

		socket.onclose = function(event) {

			console.info("# Web Socket: connection closed")

		};

		socket.onmessage = function(event) {

			console.log("# Web Socket: Receive data " + event.data);

			var data = JSON.parse(event.data);
			if (!data) return console.arror("# Web Socket: Fail parse server data" + event.data);

			if (data.Prices) $rootScope.PromoItems.setPrices(data.Prices);

			// так как мы используем внешнее событие - вручную запускаем обновление scope
			if (main_scope.$root.$$phase != '$apply' && main_scope.$root.$$phase != '$digest') main_scope.$apply();
		}

		socket.onerror = function(err) {
			console.error(err);
		}

		this.Socket = socket;

	}

	this.send = function(data) {

		this.Socket.send(JSON.stringify(data));

	}

}])