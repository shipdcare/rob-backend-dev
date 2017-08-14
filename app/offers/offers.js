'use strict';
 
angular.module('myApp.offers', ['ngRoute', 'firebase'])
 
// Declared route 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/offers', {
        templateUrl: 'offers/offers.html',
        controller: 'OffersCtrl'
    });
}])

// Home controller
.controller('OffersCtrl', function($scope, $location, $firebaseObject ,$firebaseArray) { 
     var offersRef = firebase.database().ref().child('offers'); 
     $scope.offers = $firebaseArray(offersRef);

     $scope.offer = { 
         id: 0,
         title: "",
         cashback: "",
         store_id: ""
     }

     $scope.goToCashback = function(){
        $location.path('/cashbacks');
     }

     $scope.goToBills = function(){
        $location.path('/bills');
    }

     $scope.goToOutlets = function(){
        $location.path('/outlets');
    }

    $scope.submit = function(form){
        if(form.$valid) {
            var key = firebase.database().ref().child('offers').push().key
            var newOfferRef = firebase.database().ref().child('offers/'+ key)
            newOfferRef.set($scope.offer);
            newOfferRef.update({
                id: key
            });
        }
        else{
            console.log('ERROR');
        }
    }    
});