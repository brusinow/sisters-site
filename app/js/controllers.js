angular.module('SistersCtrls', ['SistersServices'])

.controller('HomeCtrl', ['$scope', '$state','$timeout', function($scope, $state, $timeout) {
    $timeout(function () {
        console.log("fade in home!!!!");
        $scope.fadeHome = true;
    }, 600);
}])

.controller('AboutCtrl', ['$scope', '$state', function($scope, $state){
    
}]) 

.controller('NavCtrl', ['$scope','$timeout', function($scope, $timeout){
    $timeout(function () {
        $scope.fade = true;
    }, 100);
}])
