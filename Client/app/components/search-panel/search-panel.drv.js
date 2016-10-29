angular.module('redprice').directive('searchPanel', [function() {

	return {
		restrict: 'EA',
		replace: true,
		templateUrl: 'app/components/search-panel/search-panel.htm',
		link: function(scope, el, attrs) {

			App.resize(el);

			App.applyScale(el);

		},
		controller:['$scope', function($scope) {

			console.log('search panel controller');

			$scope.$watch('searchString', function(newValue){

				$scope.PromoItems.setFilter(newValue);

			}.bind(this))
		}]


	}
}])