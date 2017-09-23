angular.module('SistersCtrls', ['SistersServices'])


.controller('MainCtrl', ['$scope', '$state','$timeout','$http', function($scope, $state, $timeout,$http) {
$scope.$on('loadMainContainer', function (event, data) {
    if (data === "loaded"){
      $scope.mainLoaded = true;
    } else {
      $scope.mainLoaded = false;
    }
  });


}])

.controller('HomeCtrl', ['$scope', '$state','$timeout','$http','LoadedService', function($scope, $state, $timeout,$http,LoadedService) {
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(247, 237, 245, 0)';
  main.style.width = '';
  main.style.padding = "";
  main.style.paddingBottom = "400px";
  
  $scope.loaded = LoadedService.get();
  var width = window.innerWidth;
  if (!$scope.loaded && width > 806){ 
    $timeout(function () {
      console.log("fade me in!");
      $scope.$emit('loadMainContainer', 'loaded');
      $scope.fadeHome = true;
      LoadedService.set(true);
    }, 500);
  } else {
     $timeout(function () {
      $scope.$emit('loadMainContainer', 'loaded');
      $scope.fadeHome = true;
      LoadedService.set(true);
    },500);
  } 


    $scope.mailchimpSubmit = function(form, email, isNav){
    if(form.$valid){
     $scope.isPopup = false;
    var url = "//sisterstheband.us14.list-manage.com/subscribe/post-json?u=bc38720b0bcc7a32641bb572c&amp;id=242f4adc89&EMAIL="+email+"&c=JSON_CALLBACK"
    $http.jsonp(url).then(function success(res){
      console.log(res);
      $scope.user = {};
        if(isNav){
        $scope.mailConfirm = true;
        }
    }, function error(res){
      console.log(res);
    });

    }
  }


}])

.controller('AboutCtrl', function($scope, $state, $timeout){
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(255, 255, 255, 1)';
  main.style.padding = "0 0 176px 0";
  main.style.width = '100%';
  $scope.$emit('loadMainContainer', 'loaded');
}) 

.controller('ContactCtrl', function($scope, $state, $timeout){
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(255, 255, 255, 0)';
  main.style.padding = "";
  main.style.width = '';
  $scope.$emit('loadMainContainer', 'loaded');
}) 

.controller('PressCtrl', function($scope, $state, $timeout){
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(255, 255, 255, 0)';
  main.style.padding = "0 0 176px 0";
  main.style.width = '90%';
  $scope.$emit('loadMainContainer', 'loaded');
})

.controller('ReleaseCountdownCtrl', function($scope, $state, $timeout){
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(255, 255, 255, 0)';
  main.style.padding = "0 0 176px 0";
  main.style.width = '90%';
  $scope.$emit('loadMainContainer', 'loaded');
  $scope.showCountdown = true;
  $scope.endTime = "09 Oct 2017 13:00:00 PST"

  $scope.endCountdown = function(){
    $scope.showCountdown = false;
  }
});