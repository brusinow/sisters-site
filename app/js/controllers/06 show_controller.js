angular.module('SistersCtrls')

.controller('ShowsCtrl', ['$scope', '$state','currentAuth','$log','$firebaseArray','moment','Auth','getShows','$location', function($scope, $state, currentAuth,$log, $firebaseArray, moment, Auth, getShows, $location){
var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(252, 244, 247, 0)';
  main.style.width = '';
  main.style.padding = '';
$scope.$emit('loadMainContainer', 'loaded');
  $scope.shows = getShows;

  $scope.auth = Auth;
  $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
    // console.log("firebase user is ",$scope.firebaseUser);
  });



  $scope.open = function(whichPage){
    $location.url('/shows/'+whichPage);
  }

}]) 


.controller('SingleShowCtrl', function($scope, $stateParams, $state, $http, $timeout, $location, $sessionStorage, GetShow, GetTicket){
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(252, 244, 247, 0)';
  main.style.width = '';
  main.style.padding = '';
  
  if (GetTicket.description){
    $scope.show = GetShow;
    $scope.ticket = GetTicket;
    $scope.showUnix = $scope.ticket.unix * 1000;
    $scope.images = $scope.ticket.images;
    var currentActiveSrc = $scope.images[0];

    var mainImg = document.querySelector(".main-product-photo img");
    mainImg.src = $scope.images[0];
    $scope.$emit('loadMainContainer', 'loaded');
  } else {
    $location.url('/store');
  }


$scope.isActiveImg = function(){
  if (this.img === currentActiveSrc){
    return true;
  } else {
    return false;
  }
}



$scope.changeActive = function(){
  currentActiveSrc = this.img;
  mainImg.src = this.img;
}

})