angular.module('SistersCtrls')


.controller('NavCtrl', ['$scope','$timeout','$log','$uibModal','$http','Auth','$state','$sessionStorage','$location','$window', function($scope, $timeout,$log, $uibModal, $http, Auth, $state, $sessionStorage,$location, $window){
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
  var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  $scope.height = h;

  var mobileBG = document.getElementById("mobile-background-div");
  if (w < 900){
  mobileBG.style.height = h + "px";
  } else {
  mobileBG.style.height = 0 + "px"; 
  }
  // console.log("inner width: ",width);
  if (!$scope.loaded && w > 806){ 
    $scope.mobileWidth = false;
  } else {
     $scope.mobileWidth = true;
  } 




  

  $timeout(function(){
    // OVERLAY CREATION
   
      if (w >= 678){
      if ($scope.firebaseUser === null && $location.$$path !== "/login"){
        console.log("entering popup");
        
        if (!document.getElementById("overlayMail")){
          
          var div = document.createElement("div");
          div.id = "overlayMail";
          div.className = "overlay-start";
          var body = document.body;
          var popUp = document.querySelector("#pop-up");
          console.log(body.scrollHeight);
          div.style.height = body.scrollHeight + "px";
          popUp.appendChild(div);
          var overlay = document.querySelector("#overlayMail");
          overlay.classList.add("active");
        }
        // var scrollTop = $window.pageYOffset;
        // var content = document.querySelector("#overlay-content");
        // content.style.top = scrollTop + "px";
        $scope.isPopup = true;
      }
    };
  },6000)
    

  $scope.closePopup = function(){
    $scope.isPopup = false;
  }
    
   
  
  $scope.toStore = function(){
      $scope.isPopup = false;
      $timeout(function(){
        $window.open('https://iheartsisters.bandcamp.com/');
      },300);
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