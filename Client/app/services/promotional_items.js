angular.module('redprice').service('PromoItems', ['$rootScope', function($rootScope){

	//for debug
	window.PromoItems = this;

	this.Filter = '';

	this.Items = [];

	this.PricesHash= {};


	this.setPrices = function (prices) {

		_.each(prices, function(rate) {

			$rootScope.PromoItems.PricesHash[rate.id] = rate;

		});

		$rootScope.PromoItems.Items = _.values($rootScope.PromoItems.PricesHash);

		$rootScope.PromoItems.Items = _.sortBy($rootScope.PromoItems.Items, function(rate){

			return rate.Date;
		});

		//$rootScope.PromoItems.Items.reverse();

	};

	this.setFilter = function(filter){
		
		this.Filter = filter;

		console.log('filter: ', filter);

		$rootScope.ConnectionSrv.send({

			Action: 'getPrices',
			Filter: this.Filter

		})

	};
}])