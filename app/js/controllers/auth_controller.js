angular.module('SistersCtrls')

.controller('LoginCtrl', ['$scope', '$state','Auth', function($scope, $state, Auth){
  $scope.submitted = false;
  $scope.logged = false;


  Auth.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      $scope.logged = true;
      $state.go('home');
      console.log("Signed in as:", firebaseUser.uid);
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
      console.log("Signed in as:", firebaseUser.uid);
      $scope.firebaseUser = firebaseUser;
    }).catch(function(error) {
      console.error("Authentication failed:", error);
    })
  };


}]) 