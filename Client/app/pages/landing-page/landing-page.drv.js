angular.module('redprice').directive('landingPage', [function() {

	return {
		restrict: 'EA',
		replace: true,
		templateUrl: 'app/pages/landing-page/landing-page.htm',
		link: function(scope, el, attrs) {

			App.resize(el);

			App.applyScale(el);

		},
		controller: function() {


		}
	}
}])