
var RP = global.RP = {

	Connections: {}

};

RP.Config = require('./Config/Config');

RP.Casper = require('casper').create({
	//verbose: true,
	//logLevel: 'debug'
	pageSettings: {
		loadImages: false,
		loadPlugins: false
	}
});


var _ = global.require('underscore');

require('./classes/Service');

require('./classes/Broadcast');

require('./Services/Grabber');



RP.Grabber.startGrabbing();

