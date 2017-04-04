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

.controller('AdminProductsCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage, Auth, allProducts){

  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(255,255,255,0)';
  main.style.width = '';
  $scope.$emit('loadMainContainer', 'loaded');

  $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
    // console.log("firebase user is ",$scope.firebaseUser);
  });

  $scope.products = allProducts;

  $scope.addProduct = function(){
    $state.go('admin.products-add');
  }

  $scope.editProduct = function(id){
    console.log("edit: ",id);
  }

  $scope.deleteProduct = function(id){
    console.log("index: ",id);
    allProducts.$remove(allProducts[id]).then(function(ref) {
      console.log("deleted");
    });
  }



})

.controller('AdminProductsAddCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage, Auth, ProdSkuFactory, UploadImages, HelperService){

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
  $scope.product = {
    variant: {
      bool: false,
      skus: []
    },
    shippable: false,
    active: true
  };


  $scope.addVariant = function(){
    var newObj = {
      "variantName": "",
      "price": ""
    }
    $scope.product.variant.skus.push(newObj);
  }

  $scope.deleteVariant = function(index){
    $scope.product.variant.skus.splice(index, 1);
  }

  $scope.variantUp = function(index){
    if (index > 0){
      var temp = $scope.product.variant.skus[index];
      $scope.product.variant.skus[index] = $scope.product.variant.skus[index - 1];
      $scope.product.variant.skus[index - 1] = temp;
    }
  }

  $scope.variantDown = function(index){
    if (index < $scope.product.variant.skus.length - 1){
      var temp = $scope.product.variant.skus[index];
      $scope.product.variant.skus[index] = $scope.product.variant.skus[index + 1];
      $scope.product.variant.skus[index + 1] = temp;
    }
  }

  $scope.makeMainImage = function(i){
    console.log("before: ",$scope.obj.flow);
    var tmp = $scope.obj.flow.files.splice(i, 1);
    console.log("temp: ",tmp);
    $scope.obj.flow.files.unshift(tmp[0]);
    console.log("after: ",$scope.obj.flow);
  }


$scope.submit = function(){
  ProdSkuFactory.get("prod").then(function(id){
    var productId = HelperService.idGenerator(id, "prod");
    UploadImages($scope.obj.flow.files, "store", productId).then(function(links){
      $scope.product.images = links;
      $scope.product.id = productId;
      var skus = {};
      ProdSkuFactory.get("sku").then(function(skuResult){
        var skuNum = skuResult;
        if ($scope.product.variant.skus.length > 0){            
        var array = $scope.product.variant.skus;
        for (var i = 0; i < array.length; i++){
          console.log("current variant: ",array[i].variantName); 
            var currentSku = HelperService.idGenerator(skuNum, "sku");  
            console.log("currentSku: ",currentSku);   
            var data = {
              "variantName": array[i].variantName,
              "price": array[i].price,
              "parentId": productId,
              "id": currentSku
            }
            skus[currentSku] = data;
            if (i !== array.length - 1){
              skuNum++;
            }    
        }
        ProdSkuFactory.set(skuNum, "sku");
      } else {
        console.log("else");
        ProdSkuFactory.get("sku").then(function(currentSku){
          skus[currentSku] = {
            variantName: null,
            price: $scope.product.price,
            parentId: productId,
            id: currentSku
          }
        });
      }
      $scope.product.variant.skus = skus;
      console.log($scope.product);
      var productRef = firebase.database().ref('products/' + productId);
      productRef.set($scope.product).then(function(){
        console.log("saved!!!");
        ProdSkuFactory.set(id, "prod");
      })
      });

     
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

