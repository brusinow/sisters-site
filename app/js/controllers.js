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



.controller('ShowsCtrl', ['$scope', '$state','currentAuth','$uibModal','$log','$firebaseArray','moment','Auth','getShows', function($scope, $state, currentAuth, $uibModal,$log, $firebaseArray, moment, Auth, getShows){
  
  $scope.shows = getShows;

  $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;
      console.log("firebase user is ",$scope.firebaseUser);
  });


   $scope.open = function(whichPage, index) {
    console.log(index);
    var modalInstance = $uibModal.open({
      animation: true,
      backdrop: true,
      templateUrl: 'app/views/'+whichPage+'ShowModal.html',
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


.controller('editModalCtrl', function ($scope, $uibModalInstance, editShow, index, $firebaseArray) {
  $scope.shows = editShow;
  $scope.show = editShow[index];

  console.log("index is ",index);
  $scope.dateObj = new Date($scope.show.unix);
  console.log($scope.dateObj);



  $scope.ok = function () {
    $scope.show.date = moment($scope.dateObj).format('ddd, MMMM Do');
    $scope.show.unix = $scope.dateObj.getTime();
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
    var thisUnix = $scope.show.showDate.getTime();
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

.controller('NavCtrl', ['$scope','$timeout','$http','Auth','$state', function($scope, $timeout, $http, Auth, $state){
    $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;
      console.log("firebase user is ",$scope.firebaseUser);
    });
    


    $scope.user = {};
    $scope.mailConfirm = false;

    $scope.logout = function(){
      console.log("clicked log out");
      Auth.$signOut();
    };

    $scope.login = function(){
      console.log("clicked log in");
      $state.go('login');  
    }




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

