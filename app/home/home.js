'use strict';
 
angular.module('myApp.home', ['ngRoute', 'firebase'])
 
// Declared route 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl'
    });
}])
 
// Home controller
.controller('HomeCtrl', ['$scope', '$location',function($scope, $location) {

    if(window.localStorage.getItem('user_id') !== null) {
         $location.path('/bills');
    }

    var user = {
        email: '',
        password: ''
    }

    $scope.login = function(){
         $location.path('/login');
    }

    $scope.SignIn = function(event) {
        event.preventDefault();  // To prevent form refresh
        var username = $scope.user.email;
        var password = $scope.user.password;
        
        firebase.auth().createUserWithEmailAndPassword(username, password).then(function(user) {
            // Success callback
            console.log('Authentication successful');
            $location.path('/bills');
        }, function(error) {
            // Failure callback
            console.log('Authentication failure');
        }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        });
    }

}]);