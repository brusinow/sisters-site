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

.controller('AdminSidebarCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage, $window, Auth){
$scope.$emit('loadMainContainer', 'loaded');

console.log("state: ",$state);
$scope.activePill = $state.current.activetab;

$scope.goToPage = function(url){
  $location.url(url);
}


  $scope.model = {
    name: 'Tabs'
  };

})

.controller('AdminOrdersCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage, Auth, Orders, ReturnCompleteOrders, ReturnPendingOrders){
  console.log(Orders);
  $scope.completeOrders = ReturnCompleteOrders(Orders);
  $scope.pendingOrders = ReturnPendingOrders(Orders);
  $scope.orders = $scope.completeOrders;
  

  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(255,255,255,0)';
  main.style.width = '';
  $scope.$emit('loadMainContainer', 'loaded');

  $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
    // console.log("firebase user is ",$scope.firebaseUser);
  });


})

.controller('AdminProductsCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage, Auth){

  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(255,255,255,0)';
  main.style.width = '';
  $scope.$emit('loadMainContainer', 'loaded');

  $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
    // console.log("firebase user is ",$scope.firebaseUser);
  });

  $scope.addProduct = function(){
    $state.go('admin.products-add');
  }



})

.controller('AdminProductsAddCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage, Auth, StoreCurrent, UploadImages){

  // StoreCurrent.product();
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(255,255,255,0)';
  main.style.width = '';
  $scope.$emit('loadMainContainer', 'loaded');

  $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
    // console.log("firebase user is ",$scope.firebaseUser);
  });

  $scope.obj = {};

  $scope.variant = {
    bool: false,
    array: []
  }

  $scope.addVariant = function(){
    var newObj = {
      "variantName": "",
      "price": ""
    }
    $scope.variant.array.push(newObj);
  }

  $scope.deleteVariant = function(index){
    $scope.variant.array.splice(index, 1);
  }

  $scope.variantUp = function(index){
    if (index > 0){
      var temp = $scope.variant.array[index];
      $scope.variant.array[index] = $scope.variant.array[index - 1];
      $scope.variant.array[index - 1] = temp;
    }
  }

  $scope.variantDown = function(index){
    if (index < $scope.variant.array.length - 1){
      var temp = $scope.variant.array[index];
      $scope.variant.array[index] = $scope.variant.array[index + 1];
      $scope.variant.array[index + 1] = temp;
    }
  }


var submitImages = function(files){
  console.log("files: ",files);
}

$scope.testClick = function(){
  console.log("what is flow? ",$scope.obj);
}

$scope.submit = function(){
  StoreCurrent.product().then(function(productId){
    UploadImages($scope.obj.flow.files, "store", productId).then(function(links){
      console.log("we have links!: ",links);
    });
  })
  
}


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

