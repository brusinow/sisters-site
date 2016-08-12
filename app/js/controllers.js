angular.module('SistersCtrls', ['SistersServices'])

.controller('HomeCtrl', ['$scope', '$state','$timeout','LoadedService', function($scope, $state, $timeout, LoadedService) {
    $scope.loaded = LoadedService.get();
    console.log("what is loaded? ",$scope.loaded);
      
    if (!$scope.loaded){ 
    $timeout(function () {
          console.log("fade in home!!!!");
          $scope.fadeHome = true;
          LoadedService.set(true);
    }, 600);
    } 
}])

.controller('AboutCtrl', ['$scope', '$state', function($scope, $state){
    
}]) 

.controller('ShowsCtrl', ['$scope', '$state', function($scope, $state){
    
}]) 

.controller('NavCtrl', ['$scope','$timeout', function($scope, $timeout){
    $timeout(function () {
        $scope.fade = true;
    }, 100);
}])
