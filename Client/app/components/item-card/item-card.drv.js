angular.module('redprice').directive('itemCard', [function() {

	return {
		restrict: 'EA',
		replace: true,
		templateUrl: 'app/components/item-card/item-card.htm',
		link: function(scope, el, attrs) {

			App.resize(el);

			App.applyScale(el);

		},
		controller: function($scope){

		}
	}
}])