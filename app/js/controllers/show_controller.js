angular.module('SistersCtrls')

.controller('ShowsCtrl', ['$scope', '$state','currentAuth','$uibModal','$log','$firebaseArray','moment','Auth','GetShows', function($scope, $state, currentAuth, $uibModal,$log, $firebaseArray, moment, Auth, GetShows){
  $scope.shows = GetShows();
  $scope.shows.$loaded().then(function(){
    $scope.loaded = true;
    console.log($scope.shows);
  })
  

  $scope.auth = Auth;
  $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
    // console.log("firebase user is ",$scope.firebaseUser);
  });


  $scope.open = function(whichPage, id) {
    console.log(id);
    // console.log(whichPage);
    // console.log(index);
    var modalInstance = $uibModal.open({
      animation: true,
      backdrop: true,
      templateUrl: '/views/shows/'+whichPage+'ShowModal.html',
      controller: whichPage+'ModalCtrl',
      size: 'lg',
      resolve: {
        // editShow: function () {
        //   return $scope.shows;
        // },
        thisShow: function(GetSingleShow){
          return GetSingleShow(id).$loaded;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }; 

}]) 