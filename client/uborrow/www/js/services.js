angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
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
