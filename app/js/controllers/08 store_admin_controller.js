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

.controller('AdminOrdersCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage, Auth, Orders, ReturnCompleteOrders, ReturnPendingOrders){
  console.log(Orders);
  $scope.completeOrders = ReturnCompleteOrders(Orders);
  $scope.pendingOrders = ReturnPendingOrders(Orders);
  $scope.orders = $scope.completeOrders;
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


.controller('AdminTicketsCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage, Auth, Tickets){
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(255,255,255,0)';
  main.style.width = '';
  main.style.padding = '0';
  $scope.tickets = Tickets;
  $scope.$emit('loadMainContainer', 'loaded');



  $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
    // console.log("firebase user is ",$scope.firebaseUser);
  });



})


.controller('AdminTicketsEachCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage, Auth, ThisTicket, WillCall, WillCallToBlob, FileSaver, moment){
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(255,255,255,0)';
  main.style.width = '';
  main.style.padding = '0';
  $scope.ticket = ThisTicket;
  // var willCallBlob = WillCallToBlob(WillCall);
  $scope.ticketsSold = $scope.ticket.ticketCapacity - $scope.ticket.totalTickets;

  $scope.chartColors = [ '#adadad', '#f891af'];
  $scope.labels = ["Remaining Tickets", "Tickets Sold"];
  $scope.data = [$scope.ticket.totalTickets, $scope.ticketsSold];
  
  $scope.$emit('loadMainContainer', 'loaded');

  $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
    // console.log("firebase user is ",$scope.firebaseUser);
  });

  $scope.downloadList = function(){
    console.log("entering!");
    var formatDate = moment($scope.ticket.unix * 1000).format('MM/DD/YYYY');
    var textTitle = $scope.ticket.title + " (" + formatDate + ")";
    var blob = WillCallToBlob(WillCall, textTitle);
    FileSaver.saveAs(blob, moment($scope.ticket.unix * 1000).format('MM-DD-YYYY') + '.txt');
  }

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