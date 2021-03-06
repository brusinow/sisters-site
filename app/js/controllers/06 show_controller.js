angular.module('SistersCtrls')

.controller('ShowsCtrl', ['$scope', '$state','currentAuth','$log','$firebaseArray','moment','Auth','getShows','$uibModal','BandsInTown', function($scope, $state, currentAuth,$log, $firebaseArray, moment, Auth, getShows, $uibModal, BandsInTown){
var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(252, 244, 247, 0)';
  main.style.width = '';
  main.style.padding = '';
$scope.$emit('loadMainContainer', 'loaded');
  // $scope.shows = getShows;

  $scope.auth = Auth;
  $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
    // console.log("firebase user is ",$scope.firebaseUser);
  });

  BandsInTown.then(function(data){
    $scope.shows = data;
    console.log("what are shows from bands in town? ",$scope.shows);
  })



    $scope.open = function(whichPage, index) {
    var modalInstance = $uibModal.open({
      animation: true,
      backdrop: true,
      templateUrl: '/views/shows/'+whichPage+'ShowModal.html',
      controller: whichPage+'ModalCtrl',
      size: 'lg',
      resolve: {
        editShow: function () {
          return $scope.shows;
        },
        index: index
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }; 

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