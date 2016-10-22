angular.module('redprice').directive('searchResults', [function() {

	return {
		restrict: 'EA',
		replace: true,
		templateUrl: 'app/components/search-results/search-results.htm',
		link: function(scope, el, attrs) {

		},
		controller: ['$scope', function($scope){

			$scope.filterResults = function(item) {

				if (!$scope.PromoItems.Filter) return true;

				var regexp = new RegExp($scope.PromoItems.Filter, 'i');

				if (item.Title.match(regexp)) return true;

				return false;

			}

		}]
	}
}])