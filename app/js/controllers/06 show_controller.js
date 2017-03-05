angular.module('SistersCtrls')

.controller('ShowsCtrl', ['$scope', '$state','currentAuth','$log','$firebaseArray','moment','Auth','getShows','$uibModal', function($scope, $state, currentAuth,$log, $firebaseArray, moment, Auth, getShows, $uibModal){
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
  $scope.itemCount = 1;
  $scope.lowCount = false;

  $scope.$on('lowCount', function (event, data) {
    $scope.lowCount = data.bool;
    if (data.bool = true){
      $scope.itemCount = data.originalVal;
    }
    
  });

  console.log("get show! ",GetShow);
  console.log("get ticket! ",GetTicket);
  // if (GetTicket.description){
    $scope.show = GetShow;
    $scope.ticket = GetTicket.data;
    $scope.showUnix = $scope.ticket.unix * 1000;
    $scope.images = $scope.ticket.images;
    var currentActiveSrc = $scope.images[0];

    if ($scope.ticket.tixAvailableCount){
      $scope.maxTickets = $scope.ticket.tixAvailableCount
    } else {
      $scope.maxTickets = 8;
    }

    var mainImg = document.querySelector(".main-product-photo img");
    mainImg.src = $scope.images[0];
    $scope.$emit('loadMainContainer', 'loaded');
  // } else {
  //   $location.url('/store');
  // }


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