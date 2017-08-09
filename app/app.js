'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.home',
  'myApp.bills',
  'myApp.login',
  'myApp.offers',
  'myApp.cashbacks',
  'myApp.outlets',
  'myApp.outlet-bills',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({
        redirectTo: '/login'
    });
}]);
