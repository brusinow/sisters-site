angular.module('SistersCtrls')


.controller('editModalCtrl', function ($scope, $uibModalInstance, editShow, index, $firebaseArray) {
  $scope.shows = editShow;
  $scope.show = editShow[index];

  console.log("index is ",index);
  $scope.dateObj = new Date($scope.show.unix * 1000);
  console.log($scope.dateObj);



  $scope.ok = function () {
    $scope.show.date = moment($scope.dateObj).format('ddd, MMMM Do');
    $scope.show.unix = $scope.dateObj.getTime() / 1000;
    $scope.shows.$save($scope.show).then(function(ref) {
      console.log("success");
    }, function(error) {
      console.log("Error:", error);
    });
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.delete = function(){
    $scope.shows.$remove($scope.show).then(function(ref){
      console.log("successful delete: ",ref);
    }, function(error){
      console.log("error: ",error)
    });
    $uibModalInstance.close();
  }

})



.controller('newModalCtrl', function ($scope, $uibModalInstance, $firebaseArray) {

  $scope.show = {};
  var showsRef = firebase.database().ref('shows');
  $scope.showsArray = $firebaseArray(showsRef);

  $scope.ok = function () {
    var thisDate = moment($scope.show.showDate).format('ddd, MMMM Do');
    var thisUnix = $scope.show.showDate.getTime() / 1000;
    console.log(thisDate);
    var object = {
      "date": thisDate,
      "unix": thisUnix,
      "location": $scope.show.showLocation,
      "venue": $scope.show.venue,
      "venueLink": $scope.show.venueLink || "",
      "ticketLink": $scope.show.ticketLink || ""
    }
    console.log(object);
    $scope.showsArray.$add(object);
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})