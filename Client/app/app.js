angular.module('redprice', ['ngRoute']);

angular.module('redprice').config(['$routeProvider', function($routeProvider) {

	$routeProvider
		.when('/12345', {
			template: '<12345></12345>'
		})
		.when('/', {
			template: '<landing-page></landing-page>'
		})
		.otherwise(function ($injector, $location) {
			$location.path('/').replace();
		});

}]);

angular.module('redprice').config(['$locationProvider', function($locationProvider) {

	$locationProvider.html5Mode({
		enabled:true,
		requireBase: false
	});

}]);

var App = {};

App.scale = 1;

App.resize = function(){

	var width = window.innerWidth;

	this.scale = Math.min(1, width/1040);

	this.scale_search = Math.min(1, width/460);

	App.applyScale(document.body);

};

App.applyScale = function(el) {

	var els = $(el).find('[stl]');

	_.each(els, function(el) {

		var stl = $(el).attr('stl');

		var styles = stl.split(',');

		_.each(styles, function(style){

			var parts = style.split(':');

			var name = parts[0];

			var value_string = parts[1];

			var values = value_string.split(' ');
			//var value = '';

			value = _.map(values, function(v){return App.transformValue(v)}).join(' ');

			//console.log(el, name, value);
			$(el).css(name, value);

		}, this);

	}, this);

};

App.transformValue = function(value) {//console.log(this.scale_search);
	
	if(value == 'auto') {
		return value;
	}
	else {return  this.scale_search * parseFloat(value) + 'px'};

};



window.addEventListener('resize', function() {

	App.resize();
});
