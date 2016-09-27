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
    var div = document.createElement("div");
    div.id = "overlayMail";
    div.className = "overlay-start";
    var body = document.body;
    var popUp = document.querySelector("#pop-up");
    div.style.height = body.scrollHeight + "px";
    popUp.appendChild(div);
    var overlay = document.querySelector("#overlayMail");
    overlay.classList.add("active");
  
    var content = document.createElement("div");
    content.id = "overlayContent";
    content.className = "overlay-content-start";
    content.innerHTML = '<h3 class="text-center">Join our Mailing List!</h3><p>We will not mail you often, but this way you get our updates about the album and upcoming shows.</p><form name="form" class="nav-form" ng-submit="form.$valid && mailchimpSubmit()" novalidate><button type="submit" class="button-flat float-right"><i style="position: relative; bottom: 8px;"class="fa fa-paper-plane-o fa-lg" aria-hidden="true"></i></button><input class="float-right" name="uEmail" type="email" placeholder="Pop Bottles With Us!" ng-model="user.email"/><div class="mail-alerts"><span class="error" ng-show="form.uEmail.$error.email && form.$submitted">*This is not a valid email.</span><span class="mailchimp-alert-confirm" ng-class="{"confirmAnimate": mailConfirm}">YAY! SISTERS loves you. <i class="fa fa-heart" aria-hidden="true"></i></span></div></form>';
    popUp.appendChild(content);
    var ovContent = document.querySelector("#overlayContent");
    ovContent.classList.add("active");



  },8000)
    

    
   


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

.controller('FooterCtrl', ['$scope','$timeout','$log','$uibModal','$http','Auth','$state','$sessionStorage', function($scope, $timeout,$log, $uibModal, $http, Auth, $state, $sessionStorage){
  $scope.logout = function(){
    console.log("clicked log out");
    Auth.$signOut();
  };

  $scope.login = function(){
    console.log("clicked log in");
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
    console.log($uibModalInstance)
    $uibModalInstance.dismiss('cancel');
  }


}])