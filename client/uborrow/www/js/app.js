// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','starter.services', 'starter.controllers','ngResource'])

//.config(function(RestangularProvider) {
//        RestangularProvider.setBaseUrl('http://uborrowapi.nodejitsu.com/uborrow');
//})

//.config(function(RestangularProvider) {
//    RestangularProvider.setBaseUrl('http://uborrowapi.nodejitsu.com/uborrow');
//})


.config(function ( $httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
 })

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
          url: "/tab",
          abstract: true,
          templateUrl: "templates/tabs.html"
      })



      // the pet tab has its own child nav-view and history
      .state('tab.cabinet-index', {
          url: '/cabinets',
          views: {
              'cabinets-tab': {
                  templateUrl: 'templates/cabinet-index.html',
                  controller: 'CabinetsController'
              }
          }
      })

      .state('tab.item-detail', {
          url: '/item/:itemid',
          views: {
              'item-detail-tab': {
                  templateUrl: 'templates/item-detail.html',
                  controller: 'ItemDetailController'
              }
          }
      })

      .state('tab.home', {
          url: '/home',
          views: {
              'home-tab': {
                  templateUrl: 'templates/home.html'
              }
          }
      })

      .state('tab.about', {
          url: '/about',
          views: {
              'about-tab': {
                  templateUrl: 'templates/about.html'
              }
          }
      })

      .state('cabinet-detail', {
          url: '/cabinet/:id',
          templateUrl: 'templates/cabinet-detail.html',
          controller: 'CabinetDetailController'

      })

      .state('cabinet-add', {
          url: "/cabinets/add",
          templateUrl: 'templates/cabinet-add.html',
          controller: 'CabinetsController'
      });

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/tab/home');

})


