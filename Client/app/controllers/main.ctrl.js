angular.module('redprice').controller('MainCtrl', ['$rootScope' ,'$scope', 'PromoItems', 'ConnectionSrv' , function ($rootScope, $scope, PromoItems, ConnectionSrv) {

	$rootScope.PromoItems = PromoItems;

	$rootScope.ConnectionSrv = ConnectionSrv;

	$scope.scale = 1;

	$scope.scale_search = 1;

	$scope.recalculateScale = function() {

		var width = window.innerWidth;

		$scope.scale = Math.min(1, width/1040);

		$scope.scale_search = Math.min(1, width/500);

		// так как мы используем внешнее событие - вручную запускаем обновление scope
		if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
	}

	window.addEventListener('resize', function() {

		$scope.recalculateScale();

	})

	$scope.recalculateScale();

	ConnectionSrv.connect($scope);



}])