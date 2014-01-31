angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
/*
    .factory('CabinetService', function() {
        var cabinets = [
            { id: 0, name: 'cabinet1', description: 'Matthai cabinet' },
            { id: 1, name: 'cabinet2', description: 'UM Detroit Lobby' },
            { id: 2, name: 'cabinet3', description: 'Art Museum' },
            { id: 3, name: 'cabinet4', description: 'Nature Center cabinet' }
        ];

        return {
            all: function() {
                return cabinets;
            },
            get: function(id) {
                // Simple index lookup
                return cabinets[id];
            }
        }
    });
*/

.factory("flashService", function($rootScope) {
    return {
        show: function(message) {
            console.log("set flash message= " + message);
            $rootScope.flash = message;
        },
        clear: function() {
            $rootScope.flash = "";
        }
    }
})

.factory('Cabinets', function($resource){
    return $resource('http://uborrowapi.nodejitsu.com/uborrow/cabinets', {})
})


.value('version', '0.1');


//- See more at: http://coder1.com/articles/consuming-rest-services-angularjs#sthash.fUc9LLfZ.dpuf

/*
.factory("CabinetService", function( flashService, $http) {
    var factory = {};
    //$http.defaults.useXDomain = true;
    factory.list = function() {

        var cabinets =
            $http({
                method: 'GET',
                url: 'http://uborrowapi.nodejitsu.com/uborrow/cabinets'
            });
        cabinets.success(function(data, status, header, config) {
            flashService.clear();
        });
        cabinets.success(function(data, status, header, config) {
            flashService.show(status);
        });
        return cabinets;
    };

    // return park object, not promise
    factory.get = function($scope,id) {
        var url = "http://uborrowapi.nodejitsu.com/uborrow/cabinets" + id;
        var cabinet =
            $http({
                method: 'GET',
                url: url
            });
        cabinet.success( function(data, status, header, config){
            flashService.clear();
            flashService.show(status);
        });
        return cabinet;
    };

    return factory;
});*/
