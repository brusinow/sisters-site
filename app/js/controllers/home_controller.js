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
  $scope.loaded = LoadedService.get();
  // console.log("what is loaded? ",$scope.loaded);
  var width = window.innerWidth;
  // console.log("inner width: ",width);
  if (!$scope.loaded && width > 806){ 
    $timeout(function () {
      // console.log("fade in home!!!!");
      $scope.$emit('loadMainContainer', 'loaded');
      $scope.fadeHome = true;
      LoadedService.set(true);
    }, 4000);
  } else {
     $timeout(function () {
      // console.log("fade in home!!!!");
      $scope.$emit('loadMainContainer', 'loaded');
      $scope.fadeHome = true;
      LoadedService.set(true);
    }, 4000);
  } 


    $scope.mailchimpSubmit = function(form, email, isNav){
    if(form.$valid){
    // console.log("what is email? ",email);
    // console.log("submit clicked!")
     $scope.isPopup = false;
    var url = "//sisterstheband.us14.list-manage.com/subscribe/post-json?u=bc38720b0bcc7a32641bb572c&amp;id=242f4adc89&EMAIL="+email+"&c=JSON_CALLBACK"
    $http.jsonp(url).then(function success(res){
      // console.log(res);
      $scope.user = {};
        if(isNav){
        $scope.mailConfirm = true;
          $timeout(function(){
            $scope.mailConfirm = false;
            console.log("mail confirm reset");
          },7000);
        }
    }, function error(res){
      // console.log(res);
    });

    }
  }


}])

.controller('AboutCtrl', function($scope, $state){

}); 