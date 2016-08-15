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

.controller('ShowsCtrl', ['$scope', '$state','currentAuth', function($scope, $state, currentAuth){
    
}]) 

.controller('LoginCtrl', ['$scope', '$state','Auth', function($scope, $state, Auth){
  Auth.$onAuthStateChanged(function(firebaseUser) {
  if (firebaseUser) {
      console.log("Signed in as:", firebaseUser.uid);
      var thisUserRef = firebase.database().ref('users/'+firebaseUser.uid);
      thisUserRef.on("value", function(user){
          $scope.currentUser = user.val();
          console.log("current user is: ",$scope.currentUser);
          $state.go('home');
      }, function (errorObject){
          alert("Sorry! There was an error getting your data:" + errorObject.code);
        });
  } else {
    console.log("Not logged in.");
  }
});


  // bind form data to user model
  $scope.user = {}


  $scope.login = function() {
  $scope.firebaseUser = null;

  Auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser) {
  console.log("Signed in as:", firebaseUser.uid);
  $scope.firebaseUser = firebaseUser;
  }).catch(function(error) {
  console.error("Authentication failed:", error);
  })
  };


}]) 

.controller('NavCtrl', ['$scope','$timeout','$http','Auth', function($scope, $timeout, $http, Auth){
    $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;
      console.log("firebase user is ",$scope.firebaseUser);
    });
    


    $scope.user = {};
    $scope.mailConfirm = false;

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
    console.log("inner width: ",width);

    if (width > 806){
    $timeout(function () {
      $scope.fade = true;
    }, 100);
    } else {
      $scope.fade = true;
    }
}])

