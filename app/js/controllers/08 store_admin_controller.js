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
    $state.go('admin.products-edit', {id: id});
  }

  $scope.deleteProduct = function(i){
    console.log("index: ",i);
    allProducts.$remove(allProducts[i]).then(function(ref) {
      console.log("deleted");
    });
  }



})

.controller('AdminProductsAddCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage, Auth, ProdSkuFactory, UploadImages, HelperService, Variant){

  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(255,255,255,0)';
  main.style.width = '';
  $scope.$emit('loadMainContainer', 'loaded');

  $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
    // console.log("firebase user is ",$scope.firebaseUser);
  });

  $scope.obj = {
    "price": 0
  };
  $scope.newSkus = [];
  $scope.product = {
    variant: {
      bool: false,
      skus: []
    },
    shippable: false,
    active: true
  };


  $scope.addVariant = function(){
    var myObj = new Variant();
    $scope.newSkus.push(myObj);
    console.log($scope.newSkus);
  }

  $scope.deleteVariant = function(index){
    $scope.newSkus.splice(index, 1);
  }

  $scope.variantUp = function(index){
    if (index > 0){
      var temp = $scope.newSkus[index];
      $scope.newSkus[index] = $scope.newSkus[index - 1];
      $scope.newSkus[index - 1] = temp;
    }
  }

  $scope.variantDown = function(index){
    if (index < $scope.newSkus.length - 1){
      var temp = $scope.newSkus[index];
      $scope.newSkus[index] = $scope.newSkus[index + 1];
      $scope.newSkus[index + 1] = temp;
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
  console.log($scope.product);
  ProdSkuFactory.get("prod").then(function(id){
    var productId = HelperService.idGenerator(id, "prod");
    UploadImages($scope.obj.flow.files, "store", productId).then(function(links){
      $scope.product.images = links;
      $scope.product.id = productId;
      var skus = {};
      ProdSkuFactory.get("sku").then(function(skuNum){
        var productRef = firebase.database().ref('products/' + productId);
        if ($scope.newSkus.length > 0){            
        var array = $scope.newSkus;
        for (var i = 0; i < array.length; i++){
            var currentSku = HelperService.idGenerator(skuNum, "sku");   
            array[i].changeSku(currentSku);
            array[i].changeProductId(productId);
            array[i].changeIndex(i); 
            skus[currentSku] = array[i];
            if (i !== array.length - 1){
              skuNum++;
            }    
        }
        $scope.product.variant.skus = skus;
        productRef.set($scope.product).then(function(){
            console.log("saved!!!");
            ProdSkuFactory.set(id, "prod");
            ProdSkuFactory.set(skuNum, "sku");
          }, function(error){
            console.log("ERROR! ",error);
          })
      } else {
        console.log("else");
        ProdSkuFactory.get("sku").then(function(skuNum){
          var currentSku = HelperService.idGenerator(skuNum, "sku");
          console.log("current price: ",$scope.obj.price);   
          var masterItem = new Variant(productId, currentSku, null, $scope.obj.price, null)
          skus[currentSku] = masterItem;
          $scope.product.variant.skus = skus;
          productRef.set($scope.product).then(function(){
            console.log("saved!!!");
            ProdSkuFactory.set(id, "prod");
            ProdSkuFactory.set(skuNum, "sku");
          }, function(error){
            console.log("ERROR! ",error);
          })
           
        });
      }
      });

     
    });
  })
  
}


})

.controller('AdminProductsEditCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage, Auth, ProdSkuFactory, UploadImages, HelperService, product, images, Variant){

  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(255,255,255,0)';
  main.style.width = '';
  $scope.$emit('loadMainContainer', 'loaded');

  $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
  });

  $scope.product = product;
  $scope.obj = {};
  $scope.price = "";
  if (product.variant.bool === false){
    console.log(product.variant.skus)
    var key = Object.keys(product.variant.skus);
    $scope.obj.price = product.variant.skus[key].price;
  } else {
    $scope.obj.price = 0;
  }
  
  $scope.newSkus = [];

  $scope.addVariant = function(){
    var myObj = new Variant(product.id);
    $scope.newSkus.push(myObj);
    console.log($scope.newSkus);
  }

  $scope.deleteVariant = function(index){
    $scope.newSkus.splice(index, 1);
  }

  $scope.variantUp = function(index){
    if (index > 0){
      var temp = $scope.newSkus[index];
      $scope.newSkus[index] = $scope.newSkus[index - 1];
      $scope.newSkus[index - 1] = temp;
    }
  }

  $scope.variantDown = function(index){
    if (index < $scope.newSkus.length - 1){
      var temp = $scope.newSkus[index];
      $scope.newSkus[index] = $scope.newSkus[index + 1];
      $scope.newSkus[index + 1] = temp;
    }
  }

    // fill newSkus array with saved data
    console.log("WHAT ARE VARIANT SKUS???? ",product.variant.skus);
  for (prop in product.variant.skus){
    var skus = product.variant.skus;
    console.log("this variant: ",skus[prop]);
    console.log("variant index: ",skus[prop].index);
    var obj = new Variant(product.id, prop, skus[prop].variantName, skus[prop].price, skus[prop].index);
    $scope.newSkus[skus[prop].index] = obj;
    console.log($scope.newSkus);
  }
  

  $scope.makeMainImage = function(i){
    var tmp = $scope.obj.flow.files.splice(i, 1);
    $scope.obj.flow.files.unshift(tmp[0]);
  }

  $scope.submit = function(){
    UploadImages($scope.obj.flow.files, "store", product.id).then(function(links){
      $scope.product.images = links;
      var skus = {};
      ProdSkuFactory.get("sku").then(function(skuResult){
      var skuNum = skuResult;
      if ($scope.product.variant.bool === true){   
        if ($scope.newSkus.length === 0){
          alert ('Either select "No Variants" or add some.');
          return;
        }         
        for (var i = 0; i < $scope.newSkus.length; i++){
            if ($scope.newSkus[i].id === null){
              var currentSku = HelperService.idGenerator(skuNum, "sku");
               $scope.newSkus[i].id = currentSku; 
               $scope.newSkus[i].changeIndex(i);
               skus[currentSku] = $scope.newSkus[i];
                if (i !== $scope.newSkus.length - 1){
                  skuNum++;
                } 
            } else {
              $scope.newSkus[i].changeIndex(i);
              skus[$scope.newSkus[i].id] = $scope.newSkus[i];
            }  
        }
        ProdSkuFactory.set(skuNum, "sku");
      } else {
        console.log("price: ",$scope.price);
        if ($scope.price === 0){
          alert("please enter a price for this item.")
          return;
        }
        console.log("else");
        ProdSkuFactory.get("sku").then(function(currentSku){
          var masterItem = new Variant(product.Id, currentSku, null, $scope.obj.price, null)
          skus[currentSku] = masterItem;
        });
      }
      $scope.product.variant.skus = skus;
      console.log($scope.product);
      product.$save().then(function(ref) {
        ref.key === obj.$id; // true
      }, function(error) {
        console.log("Error:", error);
      });
      });

     
    });

  
}


// make into service to use in resolve (with $q) !!!!!!
$timeout(function(){
  if (images.length > 0){
    console.log("images exist");
    for (var i = 0; i < images.length; i++){
        var blob = images[i];
        console.log("blob: ",images[i]);
        console.log("flow: ",$scope.obj);
        $scope.obj.flow.addFile(blob);  
    }
  }
},100)




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

