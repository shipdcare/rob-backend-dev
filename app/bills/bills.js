'use strict';
 
angular.module('myApp.bills', ['ngRoute', 'firebase'])
 
// Declared route 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/bills', {
        templateUrl: 'bills/bills.html',
        controller: 'BillsCtrl'
    });
}])

// Home controller
.controller('BillsCtrl', function($scope, $location, $firebaseObject ,$firebaseArray, $http) {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

                var billsRef = firebase.database().ref().child('bills'); 
                $scope.bills = $firebaseArray(billsRef);

                $scope.accept = function(data){
                    var userRef= firebase.database().ref('users/'+ data.user_id);
                    var points;
                    userRef.once('value').then(function(user) {
                        var points = user.val().points + (data.offer_cashback * 0.1 * data.amount);
                        userRef.update({
                            points: points
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
                                    message: "Your bill of amount " + data.amount + " has been approved."
                                },
                                to: user.val().fcm_token
                            }
                        };
                        $http(req).then(function(response){
                            console.log(response);
                        }, function(err){
                            console.log(err);
                        });

                        firebase.database().ref('transactions').push({
                            user_id: user.$id,
                            amount: data.amount,
                            points:  (data.offer_cashback * 0.1 * data.amount),
                            offer_title: data.offer_title,
                            createdAt: firebase.database.ServerValue.TIMESTAMP
                        });
                    });

                    var ref = firebase.database().ref('bills/' + data.$id);
                    ref.update({
                        status: 'APPROVED',
                        admin_id: window.localStorage.getItem('user_id')
                    })
                };

                $scope.reject = function(data){
                    var ref = firebase.database().ref('bills/' + data.$id);
                    ref.update({
                        status: 'REJECTED',
                        admin_id: window.localStorage.getItem('user_id')
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
                                message: "Your bill of amount " + data.amount + " was rejected. Please upload a clear picture of the bill to get rewards."
                            },
                            to: user.val().fcm_token
                        }
                    };
                    $http(req).then(function(response){
                        console.log(response);
                    }, function(err){
                        console.log(err);
                    });
                };

                $scope.goToCashback = function(){
                    $location.path('/cashbacks');
                };

                $scope.goToOutlets = function(){
                    $location.path('/outlets');
                };

                $scope.goToOffers = function(){
                    $location.path('/offers');
                };

                $scope.goToOffers = function(){
                    $location.path('/offers');
                };

                $scope.goToBillsByOutlet = function() {
                    $location.path('/outlet-bills')
                }
        } else {
            $location.path('/login');
        }
    });
});