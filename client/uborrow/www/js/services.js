angular.module('starter.services', [])

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
        var Cabinet = $resource('http://uborrowapi.nodejitsu.com/uborrow/cabinets/:cabinetid', {cabinetid:'@id'});
        Cabinet.get({cabinetid:123}, function() {
            user.abc = true;
            user.$save();
        });


        return $resource(
            "http://uborrowapi.nodejitsu.com/uborrow/cabinets/:cabinetid",
            {cabinetid: "@id" },
            {
                query: {method:'GET', isArray:true},
                add: {method:'POST', params:{action:'add'}},
                revokeBorrower: {method:'POST', params:{action:'revoke'}},
                grantBorrower: {method:'POST', params:{action:'grant'}}
            }
        );
})

.factory('CabinetItems', function($resource){
        return $resource('http://uborrowapi.nodejitsu.com//uborrow/cabinets/:cabinetid/items',
            {
                retire: {method:'POST', params:{action:'close'}},
                addToCabinet : {method:'POST', params: {action:'add'}}
            }
        )
    })

.factory('Items', function($resource){
        return $resource('http://uborrowapi.nodejitsu.com/uborrow/cabinets',
            {
                retire: {method:'POST', params:{action:'close'}},
                addToCabinet : {method:'POST', params: {action:'add'}}
            }
        )
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

