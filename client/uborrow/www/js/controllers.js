angular.module('starter.controllers', [])

    // list of cabinets
    //.controller('CabinetsController', ['$scope', 'Cabinets', function($scope, Cabinets) {
    .controller('CabinetsController', function($scope,  Cabinets) {
        // Instantiate an object to store your scope data in (Best Practices)
        $scope.data = {
            cabinets: [],
            savemessage : false
        };

        $scope.getCabinets = function() {
            Cabinets.query(function(response) {
                // Assign the response INSIDE the callback
                $scope.data.cabinets = response;
            });
        }


        var formData = {
            title: "Title",
            description: "Description"
        };

        $scope.saveCabinet = function() {
            var cabinet = new Cabinets(formData);
            cabinet.action = "add";
            cabinet.$save(function(){
                $scope.savemessage = true;
            });
        };

        $scope.getCabinets();


    })

    .controller('CabinetDetailController', function($scope, $stateParams, Cabinets) {


        $scope.data = {
            currentCabinet : {},
            availableToggle: false,  // boolean to only show items that are available
            currentItem : null,
            itemList : []
        };

        $scope.setCurrentCabinet = function(cabinetid) {
            Cabinets.get({}, {'id': cabinetid}, function (response) {
                // Assign the response INSIDE the callback
                console.log("getting item " + cabinetid);
                $scope.data.currentCabinet = response;
            });
        };


        $scope.setCurrentCabinet($stateParams.id);

    })

/*
    .controller('CabinetDetailController', ['$scope', '$routeParams', 'Cabinets', 'Items',  function($scope, $routeParams,Cabinets,Items) {
        // Instantiate an object to store your scope data in (Best Practices)
        $scope.data = {
            currentCabinet : {},
            availableToggle: false,  // boolean to only show items that are available
            currentItem : null,
            itemList : []
        };


        init();

        var init = function() {
            // any other run-once inits; dropdowns, lookups, child items
        }

        $scope.setCurrentCabinet = function(cabinetid) {
            Cabinets.get(function(response) {
                // Assign the response INSIDE the callback
                $scope.data.currentCabinet = response;
            });
            setItemList(cabinetid);
        }

        $scope.setItemList = function(cabinetId) {
            Items.getCabinetITems({
                excludeCheckedOut: scope.data.checkoutToggle  // restful call parameters
            }, function (data) {
                scope.data.itemList = data;
            });
        };

        $setCurrentCabinet($routeParams.cabinetid);


    }])
*/

    // Master/De
    .controller('ItemDetailController', ['$scope', ' $stateParams','Items', function (scope, $routeParams, Items) {
        scope.data = {
            currentItem: {}
        };

        scope.setCheckoutToggle = function (toggle) {
            var oldToggle = angular.copy(scope.data.checkoutToggle);
            scope.data.checkoutToggle = toggle;
        };

        scope.setCurrentItem = function (itemid) {
            Items.get({
                id: itemid
            }, function (data) {
                scope.data.currentItem = data;
            });
        };

        scope.setCurrentItem($routeParams.itemid);
    }]);

//- See more at: http://coder1.com/articles/consuming-rest-services-angularjs#sthash.fUc9LLfZ.dpuf