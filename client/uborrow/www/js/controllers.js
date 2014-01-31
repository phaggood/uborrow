angular.module('starter.controllers', [])

/*    .controller('CabinetIndexCrl', function($scope, CabinetService ) {
        $scope.cabinets =  CabinetService.list();
        //$scope.cabinets = Restangular.allUrl('googlers', '/cabinets').getList();; //CabinetService.all();
    })
    .controller('CabinetDetailCtrl', function($scope, $stateParams, CabinetService) {
        // "Pets" is a service returning mock data (services.js)
        $scope.cabinet = CabinetService.get($stateParams.id);
    })*/

 /*  .controller('CabinetIndexCrl', ['$scope', 'Cabinet', function($scope, Cabinet) {
        $scope.cabinets = Cabinet.query();
        //$scope.orderProp = 'age';
    }])

    .controller('CabinetDetailCtrl', ['$scope', '$routeParams', 'Cabinet', function($scope, $routeParams, Cabinet) {
        $scope.cabinet = Cabinet.get({cabinetId: $routeParams.cabinetId}, function(cabinet) {
            //$scope.mainImageUrl = phone.images[0];
        });

        //$scope.setImage = function(imageUrl) {
        //    $scope.mainImageUrl = imageUrl;
        //}
    }])*/


.controller('CabinetController', ['$scope', 'Cabinets', function($scope, Cabinets) {
    // Instantiate an object to store your scope data in (Best Practices)
    $scope.data = {};

    Cabinets.query(function(response) {
        // Assign the response INSIDE the callback
        $scope.data.cabinets = response;
    });

}]);

//- See more at: http://coder1.com/articles/consuming-rest-services-angularjs#sthash.fUc9LLfZ.dpuf