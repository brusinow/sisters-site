angular.module('SistersCtrls')

.controller('LoginCtrl', ['$scope', '$state','Auth', function($scope, $state, Auth){
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(0,0,0,0)';
  $scope.$emit('loadMainContainer', 'loaded');
  $scope.submitted = false;
  $scope.logged = false;


  Auth.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      $scope.logged = true;
      $state.go('home');

    } else {
      console.log("Not logged in.");
    }
  });


  // bind form data to user model
  $scope.user = {}


  $scope.login = function() {
    $scope.submitted = true;
    $scope.firebaseUser = null;
    Auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    }).catch(function(error) {
      console.error("Authentication failed:", error);
    })
  };


}]) 