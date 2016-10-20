angular.module('SistersCtrls')


.controller('NavCtrl', ['$scope','$timeout','$log','$uibModal','$http','Auth','$state','$sessionStorage', function($scope, $timeout,$log, $uibModal, $http, Auth, $state, $sessionStorage){
  console.log("nav loaded")
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

  

  $timeout(function(){
    // OVERLAY CREATION
    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (w >= 678){
    $scope.isPopup = true;
    var div = document.createElement("div");
    div.id = "overlayMail";
    div.className = "overlay-start";
    var body = document.body;
    var popUp = document.querySelector("#pop-up");
    div.style.height = body.scrollHeight + "px";
    popUp.appendChild(div);
    var overlay = document.querySelector("#overlayMail");
    overlay.classList.add("active");
    };
  },8000)
    

  $scope.closePopup = function(){
    $scope.isPopup = false;
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

.controller('FooterCtrl', ['$scope','$timeout','$log','$uibModal','$http','Auth','$state','$sessionStorage', function($scope, $timeout,$log, $uibModal, $http, Auth, $state, $sessionStorage){
  $scope.auth = Auth;
  $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
  });
  
  $scope.logout = function(){
    // console.log("clicked log out");
    Auth.$signOut();
  };

  $scope.login = function(){
    // console.log("clicked log in");
    $state.go('login');  
  }




  var width = window.innerWidth;
  if (width > 806){
    $timeout(function () {
      $scope.fade = true;
    }, 100);
  } else {
    $scope.fade = true;
  }
}])





.controller('MailModalCtrl', ['$scope','$timeout','$uibModal','$uibModalInstance','$http','Auth','$state','$sessionStorage', function($scope, $timeout,$uibModal,$uibModalInstance, $http, Auth, $state, $sessionStorage){
  $scope.close = function(){
    // console.log($uibModalInstance)
    $uibModalInstance.dismiss('cancel');
  }


}])