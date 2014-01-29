angular.module('starter.controllers', [])


    .controller('CabinetIndexCrl', function($scope, CabinetService) {
        // "Pets" is a service returning mock data (services.js)
        $scope.cabinets = CabinetService.all();
    })
    .controller('CabinetDetailCtrl', function($scope, $stateParams, CabinetService) {
        // "Pets" is a service returning mock data (services.js)
        $scope.cabinet = CabinetService.get($stateParams.id);
    });
