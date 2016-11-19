RP.Grabber = new Service({

	Name: 'Grabber',

	initialize: function() {

		this.Query = [];

		this.Data = [];


	},

	run: function() {console.log('casper0');

		this.runCasperProcess();

		setInterval(function() {

			RP.Grabber.runCasperProcess();

		}, 3600 * 1000)

	},

	runCasperProcess: function() { console.log('casper1');

		var spawn = require('child_process').spawn;
		var prc = spawn('casperjs', ['Server/casper.js']);
console.log('casper2');
//noinspection JSUnresolvedFunction
		prc.stdout.setEncoding('utf8');
		prc.stdout.on('data', function (data) { console.log('casper3');
			var str = data.toString();
			var lines = str.split(/(\r?\n)/g);
			console.log(lines.join(""));
		});

		prc.on('close', function (code) {
			console.log('Casperjs  process exit code ' + code);

			RP.Prices.updatePricesCache();
		});

	},
	startGrabbing: function() {console.log('casperStartGrabbing');

		RP.Grabber.openPage('http://www.ebay.com', '.ddcrd.daily-deal', {}, function() {

			var ii = 0;

			var result = this.evaluate(getLinks);

			for (var i = 0; result[i]; i++) {
				console.log(i);
				ii++;
				console.log(result[i].Title);
				console.log(result[i].ItemUrl);
				console.log(result[i].ImageUrl);
				//RP.Grabber.sendTOServer(result[i].Title);
				//RP.Grabber.sendTOServer(result[i]);
			};

			console.log(ii);

			//this.echo(JSON.stringify(result));

			RP.Grabber.Query = result || [];

			RP.Grabber.processQuery();

//			RP.Grabber.sendTOServer({
//				//Source: 'https://e-dostavka.by/catalog/red/',
//				Links: result
//			});

		});

		function getLinks() { console.log('casperGetLinks');

			//document.body.scrollTop = 10000;
			//var links = document.querySelectorAll('.products_card');ddcrd daily-deal
			var links = document.querySelectorAll('.ddcrd.daily-deal');
			var results = [];

			for (var i = 0; links[i]; i++) {

				//var title = links[i].querySelector('div.title a.fancy_ajax').innerText;
				var title = links[i].querySelector('a span.tl').innerText;
				var cost = links[i].querySelector('div span.prc').innerText;
				var image = links[i].querySelector('a div img').getAttribute('src');
				var itemUrl = links[i].querySelector('a').getAttribute('href');

				//return title.innerText;
				results.push({Title: title, Cost: cost, Image: image, ImageUrl: '../../../img/ebay1.png', ItemUrl: itemUrl});

			}
			return results;
		}

	},
	processQuery: function() { console.log('casperProcessQuery');

		var item = this.Query[0];
		
		console.log('item---------------');

		if (item) {

			this.Query.splice(0, 1);

			RP.Grabber.openPage(item.ItemUrl, 'div.refit-itemcard-detail', {loadImages: false}, function() {console.log('item----111-------');

				var result = this.evaluate(function () {

                    var item = {};

                    item.Title = document.querySelector('h3.refit-itemcard-title ellipse-3 a span').innerText;

					item.Date = new Date();

                    //item.rate = document.querySelectorAll('span.vi-core-prdReviewCntr i.fullStar').length;

                    return item;

                });

				result.Image = item.Image;

				//result.Title = item.Title;

               result.Cost = item.Cost;

				result.ImageUrl = item.ImageUrl;

				result.ItemUrl = item.ItemUrl;

                RP.Grabber.Data.push(result);

				RP.Grabber.processQuery();

			});

			//RP.Grabber.processQuery();

		}
		else {

//			console.log('complite' + this.Data);
			console.log('complite------------------------'+ this.Data);

			RP.Grabber.sendTOServer({
				//Source: 'https://e-dostavka.by/catalog/red/',
				Links: this.Data
			});

		}

	},

	openPage: function(url, selector, options, next) { console.log('1222');

		if(options.loadImages === false) {

			RP.Casper.options.pageSettings = {

				loadImages: false,
				loadPlugins: false
			}

		} else {

			RP.Casper.options.pageSettings = {

				loadImages: true,
				loadPlugins: true
			}

		}

		RP.Casper.start(url);
		RP.Casper.options.viewportSize = {width: 1920, height: 5965};
console.log('1222222222222222');
		RP.Casper.then(function () { console.log('2222');
			RP.Casper.waitFor(function check() {
				return this.evaluate(function(selector) {
					document.body.scrollTop = 100000;
					//return document.querySelectorAll('.products_card').length > 50;
					return document.querySelectorAll(selector).length > 24;
				}, {
                    selector: selector
                });
			}, function() { console.log('Elements successfully found');

			}, function() {console.log('Time is over');

			}, 5000);
		});

		RP.Casper.run(function () {

			next.apply(this, []);

		});

	},

	sendTOServer: function(data) {

		//console.log('data', JSON.stringify(data), RP.Config.Url+":"+RP.Config.Port+'/Prices/add');

		setTimeout(function() {
			RP.Casper.done();
		}, 5000);

		RP.Casper.open(RP.Config.Url + ":" + RP.Config.Port + '/Prices/add', {
			method: 'POST',
			encoding: 'utf8',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
			data: data
		})

	}

})