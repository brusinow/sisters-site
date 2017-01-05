angular.module('SistersCtrls')


.controller('AdminMainCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage, Auth){
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(255,255,255,0)';
  main.style.width = '';
  main.style.padding = '0';
  $scope.$emit('loadMainContainer', 'loaded');

  $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
    // console.log("firebase user is ",$scope.firebaseUser);
  });

})

.controller('AdminOrdersCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage, Auth, Orders){
  console.log(Orders);
  $scope.orders = Orders;
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(255,255,255,0)';
  main.style.width = '';
  main.style.padding = '0';
  $scope.$emit('loadMainContainer', 'loaded');

  $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
    // console.log("firebase user is ",$scope.firebaseUser);
  });

})


.controller('AdminTicketsCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage, Auth){
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(255,255,255,0)';
  main.style.width = '';
  main.style.padding = '0';
  $scope.$emit('loadMainContainer', 'loaded');

  $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
    // console.log("firebase user is ",$scope.firebaseUser);
  });

})




.controller('StoreProductAddCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage, Auth){
    var main = document.getElementById("main");
    main.style.backgroundColor = 'rgba(255,255,255,0)';
    main.style.width = '';
    main.style.padding = '';
    $scope.loaded = false;

    $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
    // console.log("firebase user is ",$scope.firebaseUser);
    });
    


    $timeout(function(){
        $scope.loaded = true;
        $scope.$emit('loadMainContainer', 'loaded'); 
    })
 
})