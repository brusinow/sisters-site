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

.controller('NavCtrl', ['$scope','$timeout','$http', function($scope, $timeout, $http){
    $scope.user = {};
    $scope.mailConfirm = false;

    $scope.mailchimpSubmit = function(){
      console.log("submit clicked!")
      var req = {
        url: "//sisterstheband.us14.list-manage.com/subscribe/post?u=bc38720b0bcc7a32641bb572c&amp;id=242f4adc89",
        method: "POST",
        params: {
          EMAIL: $scope.user.email,
        }
      }


      $http(req).then(function success(res){
        console.log(res);
        $scope.user = {};
        $scope.mailConfirm = true;
        $timeout(function(){
          $scope.mailConfirm = false;
          console.log("mail confirm reset");
        },7000);
      }, function error(res){
        console.log(res);
      });
    }



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

