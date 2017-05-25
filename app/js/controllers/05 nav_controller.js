angular.module('SistersCtrls')


.controller('NavCtrl', ['$scope','$timeout','$log','$uibModal','$http','Auth','$state','$sessionStorage','$localStorage','$location','$window', function($scope, $timeout,$log, $uibModal, $http, Auth, $state, $sessionStorage, $localStorage, $location, $window){
  // $scope.sessionStorage = $sessionStorage;
  // if (!$scope.sessionStorage.hash){
  //   $scope.sessionStorage.hash = Math.random().toString(36).slice(2);
  // } else {
  //   console.log("already a session hash");
  // }
  // console.log("What is session storage? ",$scope.sessionStorage);
  $scope.fade = true;
  $scope.auth = Auth;
  $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
  });

  $scope.$storage = $localStorage;
  var counter;
  var stopped;

  $scope.$on('setTimer', function (event, data) {
    console.log("proving that data is making it to nav: ",data);
    $scope.setTimer = data;
    if ($scope.setTimer === true){
      $scope.stop();
      $scope.minutes = Math.floor((counter % (60 * 60)) / (60));
      $scope.seconds = Math.floor(counter % 60);
      $scope.countdown();
    }
  });

  $scope.countdown = function() {
    console.log(counter);
    stopped = $timeout(function() {
     if (counter > 1){
      counter--; 
      $scope.minutes = Math.floor((counter % (60 * 60)) / (60));
      $scope.seconds = Math.floor(counter % 60);
      $scope.countdown(); 
     } else {
       console.log("done!");
       $scope.setTimer = false;
      $state.go("storeCart", { message: "Your reserved tickets have expired. If you still plan to complete this purchase, add your tickets again and complete your order within 10 minutes.", messageType: "info" })
      $timeout.cancel(stopped);
      counter = 60;
     }     
    }, 1000);
  };

  $scope.stop = function(){
   $timeout.cancel(stopped);
    counter = 60;
    } 

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
   
      // if (w >= 678){
      if ($scope.firebaseUser === null && $location.$$path !== "/login" && !$scope.$storage.popup){
   
        
        if (!document.getElementById("overlayMail")){
          
          var div = document.createElement("div");
          div.id = "overlayMail";
          div.className = "overlay-start";
          var body = document.body;
          var popUp = document.querySelector("#pop-up");
      
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
    // };
  },6000)
    

  $scope.closePopup = function(){
    $scope.isPopup = false;
    $scope.$storage.popup = true;
  }
    
   
  
  $scope.toStore = function(){
      $scope.isPopup = false;
      $timeout(function(){
        $window.open('https://iheartsisters.bandcamp.com/');
      },300);
  }




  $scope.toggle = true;
  var width = window.innerWidth;


 


}])

.controller('FooterCtrl', ['$scope','$timeout','$log','$uibModal','$http','Auth','$state','$localStorage', function($scope, $timeout,$log, $uibModal, $http, Auth, $state, $localStorage){
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

}])





.controller('MailModalCtrl', ['$scope','$timeout','$uibModal','$uibModalInstance','$http','Auth','$state','$sessionStorage', function($scope, $timeout,$uibModal,$uibModalInstance, $http, Auth, $state, $sessionStorage){
  $scope.close = function(){
    // console.log($uibModalInstance)
    $uibModalInstance.dismiss('cancel');
  }


}])