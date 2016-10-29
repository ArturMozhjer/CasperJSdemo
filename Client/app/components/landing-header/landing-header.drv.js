angular.module('redprice').directive('landingHeader', [function() {

	return {
		restrict: 'EA',
		replace: true,
		templateUrl: 'app/components/landing-header/landing-header.htm',
		link: function(scope, el, attrs) {

			App.resize(el);

			App.applyScale(el);

		},
		controller: function() {


		}
	}
}])