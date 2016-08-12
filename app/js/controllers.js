angular.module('SistersCtrls', ['SistersServices'])

.controller('HomeCtrl', ['$scope', '$state','$timeout','LoadedService', function($scope, $state, $timeout, LoadedService) {
    $scope.loaded = LoadedService.get();
    console.log("what is loaded? ",$scope.loaded);
    var width = window.innerWidth;
    console.log("inner width: ",width);
      
    if (!$scope.loaded && width > 806){ 
    $timeout(function () {
          console.log("fade in home!!!!");
          $scope.fadeHome = true;
          LoadedService.set(true);
    }, 600);
    } else {
      $scope.fadeHome = true;
      LoadedService.set(true);
    } 
}])

.controller('AboutCtrl', ['$scope', '$state', function($scope, $state){
    
}]) 

.controller('ShowsCtrl', ['$scope', '$state', function($scope, $state){
    
}]) 

.controller('NavCtrl', ['$scope','$timeout', function($scope, $timeout){
    $scope.toggle = true;
    var width = window.innerWidth;
    console.log("inner width: ",width);

    if (width > 806){
    $timeout(function () {
      $scope.fade = true;
    }, 100);
    } else {
      $scope.fade = true;
    }
}])
