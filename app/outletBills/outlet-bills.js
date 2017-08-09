'use strict';
 
angular.module('myApp.outlet-bills', ['ngRoute', 'firebase'])
 
// Declared route 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/outlet-bills', {
        templateUrl: 'outletBills/index.html',
        controller: 'OutletBillsCtrl'
    });
}])

// Home controller
.controller('OutletBillsCtrl', function($scope, $location, $firebaseObject ,$firebaseArray) { 

    $scope.store_id = null;

    $scope.submit = function(form){
        if(form.$valid) {
            //e.preventDefault();
             var billsRef = firebase.database().ref().child('bills').orderByChild('store_id').equalTo($scope.store_id); 
             $scope.bills = $firebaseArray(billsRef);
        }
        else{
            console.log('ERROR');
        }
    } 

     var billsRef = firebase.database().ref().child('bills').orderByChild('store_id').equalTo($scope.store_id); 
     $scope.bills = $firebaseArray(billsRef);

     $scope.goToCashback = function(){
        $location.path('/cashbacks');
     }

     $scope.goToBills = function(){
        $location.path('/bills');
    }
    
    $scope.goToOffers = function(){
        $location.path('/offers');
    }

    $scope.goToOutlets = function(){
        $location.path('/outlets');
    }
});