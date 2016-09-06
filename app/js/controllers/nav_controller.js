angular.module('SistersCtrls')


.controller('NavCtrl', ['$scope','$timeout','$http','Auth','$state','$sessionStorage', function($scope, $timeout, $http, Auth, $state, $sessionStorage){
  // $scope.sessionStorage = $sessionStorage;
  // if (!$scope.sessionStorage.hash){
  //   $scope.sessionStorage.hash = Math.random().toString(36).slice(2);
  // } else {
  //   console.log("already a session hash");
  // }
  // console.log("What is session storage? ",$scope.sessionStorage);


  $scope.auth = Auth;
  $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
  });



  $scope.user = {};
  $scope.mailConfirm = false;

  $scope.logout = function(){
    console.log("clicked log out");
    Auth.$signOut();
  };

  $scope.login = function(){
    console.log("clicked log in");
    $state.go('login');  
  }




  $scope.mailchimpSubmit = function(){
    console.log("submit clicked!")
    var url = "//sisterstheband.us14.list-manage.com/subscribe/post-json?u=bc38720b0bcc7a32641bb572c&amp;id=242f4adc89&EMAIL="+$scope.user.email+"&c=JSON_CALLBACK"
    $http.jsonp(url).then(function success(res){
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

  if (width > 806){
    $timeout(function () {
      $scope.fade = true;
    }, 100);
  } else {
    $scope.fade = true;
  }
}])
