RP.Prices = new Service({

	Name: 'Prices',

	Model: {

		Title: {
			type: String
		},
		Image: {
			type: String
		},
		ImageUrl: {
			type: String
		},
		ItemName: {
			type: String
		},
		Cost: {
			type: String
		},
		Discount: {
			type: Number
		},
		Hash: {
			type: String
		},
		Link: {
			type: String
		},
		Date: {
			type: Date,
			defaul: Date.now
		}
	},

	Events: {

		'Database Ready': function(){
console.log(RP.Mongo);
			this.Collection = RP.Mongo.collection('Prices');

			RP.Cache.create(this.Name, function(ready){

				RP.Prices.updatePricesCache(function(){


				ready();

			});
			});

		},
		'User Connected': function(connection_data) {

			RP.SendToConnection(connection_data, {

				Prices: this.BestPrices
			});

		},
		'Best Prices Cache Updated': function(){

			RP.SendToAllConnection({

				Prices: this.BestPrices
			});

		}
	},

//			Title: "евроопт",
//		Image: "/img/orage.jpg",
//		ImageUrl: "/img/euroopt.jpg",
//		ItemName: "апельсины",
//		Cost: 1.5,
//		Discount: 30

	Routes: {
		
		'/Prices/add': function(req) {

			//console.log('4444444', req.body)

			RP.Prices.processNewPrices(req.body.Links);

		}

	},

	Actions: {

		getBestPrices: function(connection_data, data) {

			//console.log('11111110', data)

			this.getPrices(data.Filter, function(prices) {

				console.log('111', data, prices);

				RP.SendToConnection(connection_data, {

				Prices: prices
			});

			})



		}

	},

	initialize: function(){

		this.BestPrices = [];

	},

	processNewPrices: function(prices) {

		RP.Prices.Collection.remove({}, function(){});

		_.each(prices, function(price_data){

			var price = RP.Prices.Collection.insert({
				Title: price_data.Title,
				Image: price_data.Image,
				Cost: price_data.Cost,
				ImageUrl: price_data.ImageUrl,
				Date: price_data.Date

			}, function(err, price) {

				RP.Logger.debug('доюавлены новые скидки', price)

			});

//			price.save(function() {

//				RP.Logger.debug('доюавлены новые скидки', price)

//			});
		});

/*		_.each(prices, function(price_data){

					//строка для хэширования
		//var key_string = rate_data.title + '_' + rate_data.message

		//создаем уникальный хеш для этого отзыва
		var sha = RP.Crypto.creatHash('sha256');

		sha.update(key_string)

		}, this)
*/
	},

	updatePricesCache: function(next){

			RP.Prices.getBestPrices(function(prices){

				RP.Prices.BestPrices = prices;

				Broadcast.call('Best Prices Cache Updated');

				if(next) next();

			})

	},

	getBestPrices: function(next) {

		this.Collection.find({}, {Title: true, Cost: true, Image: true, ImageUrl: true}, {/*sort: {Title: 1}*/}).toArray(function(err, result) {

			next(result);
		})
	},

	getPrices: function(filter, next) {

		try {

			var regexp = new RegExp(filter);


			this.Collection.find({Title: regexp}, {Title: true, Cost: true, Image: true, ImageUrl: true}, {/*sort: {Title: 1}*/}).toArray(function(err, result) {

					next(result);
			})

		} catch(e) {

		}
	}

})
