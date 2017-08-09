'use strict';
 
angular.module('myApp.cashbacks', ['ngRoute', 'firebase'])
 
// Declared route 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/cashbacks', {
        templateUrl: 'cashbacks/cashbacks.html',
        controller: 'CashbacksCtrl'
    });
}])

// Home controller
.controller('CashbacksCtrl', function($scope, $location, $http, $firebaseObject ,$firebaseArray) { 
    var cashbacksRef = firebase.database().ref().child('cashbacks'); 
    $scope.cashbacks = $firebaseArray(cashbacksRef);

    $scope.approve = function(data){
        var ref = firebase.database().ref('cashbacks/' + data.$id);
        ref.update({
            state: 'INITIATED'
        })
    }

    $scope.success = function(data){
        var fcm_token="";
        var ref = firebase.database().ref('cashbacks/' + data.$id);
        ref.once('value').then(function(cashback) {
            var user_id = cashback.val().user_id;
            var userRef= firebase.database().ref('users/'+ user_id);
            userRef.once('value').then(function(user) {
                fcm_token = user.val().fcm_token;

                firebase.database().ref('transactions').push({
                    user_id: user_id,
                    amount: cashback.val().amount,
                    points:  -parseInt(cashback.val().amount)* 10,
                    offer_title: "PayTm recharge",
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                });

                var req = {
                    method: 'POST',
                    url: 'https://fcm.googleapis.com/fcm/send',
                    headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'key=AIzaSyAWcDc3PIAuxSlyV0HJIoZDOfTGo2QMX40'
                    },
                    data: {
                        data: {
                            message: "You have recieved PayTm cashback of Rs. " + cashback.val().amount 
                        },
                        to: fcm_token
                    }
                };
                $http(req).then(function(response){
                    console.log(response);
                }, function(err){
                    console.log(err);
                });
            });
        });
        ref.update({
            state: 'SUCCESS'
        });
    }

    $scope.error = function(data){
        var ref = firebase.database().ref('cashbacks/' + data.$id);
        ref.update({
            state: 'ERROR'
        })
    }

    $scope.goToBills = function(){
        $location.path('/bills');
    }

    $scope.goToOutlets = function(){
        $location.path('/outlets');
    }

    $scope.goToOffers = function(){
        $location.path('/offers');
    }
});