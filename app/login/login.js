'use strict';
 
angular.module('myApp.login', ['ngRoute', 'firebase'])
 
// Declared route 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'login/login.html',
        controller: 'LoginCtrl'
    });
}])
 
// login controller
.controller('LoginCtrl', ['$scope', '$location', '$rootScope' ,function($scope, $location, $rootScope) {

    var user = {
        email: '',
        password: ''
    }

    $scope.SignIn = function(event) {
        event.preventDefault();  // To prevent form refresh
        var username = $scope.user.email;
        var password = $scope.user.password;
        
        firebase.auth().signInWithEmailAndPassword(username, password).then(function(user) {
            $location.path('/bills');
             $scope.$apply()
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