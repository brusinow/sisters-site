angular.module('SistersCtrls')


.controller('StoreCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage, allProducts, Auth){
    var main = document.getElementById("main");
    main.style.backgroundColor = 'rgba(255,255,255,0)';
    main.style.width = '';
    main.style.padding = '';
    $scope.loaded = false;
    $scope.products = allProducts;
    console.log($scope.products);

      $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
  });
    
    $scope.showProduct = function(id){
      console.log("click", id);
      $state.go('storeShow', {id:id});
    }

    $scope.addProduct = function(){
      $state.go('addProduct');
    }


    $timeout(function(){
        $scope.loaded = true;
        $scope.$emit('loadMainContainer', 'loaded'); 
    })
 
})

.controller('StoreCartCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage){
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(255,255,255,0)';

  $timeout(function(){
      $scope.$emit('loadMainContainer', 'loaded');
  },1);


  $scope.toCheckout = function(){
    $location.url('/store/checkout/address');
  }

  $scope.continue = function(){
    $location.url('/store');
  }
})



.controller('StoreShowCtrl', function($scope, $stateParams, $state, $http, $timeout, $location, $sessionStorage, oneProduct){
  var main = document.getElementById("main");
  main.style.backgroundColor = '';
  $scope.$emit('loadMainContainer', 'loaded');
  if (oneProduct.description){
    $scope.product = oneProduct;
    $scope.images = oneProduct.images;
    var currentActiveSrc = $scope.images[0];

    $scope.skus = $scope.product.skus.data;

    $scope.data = {};
    $scope.data.selected = $scope.product.skus[0];


    var mainImg = document.querySelector(".main-product-photo img");
    mainImg.src = $scope.images[0];
  } else {
    console.log("RELOCATING!!");
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






.controller('CheckoutTemplateCtrl', function($scope, $state, $http, $timeout, $location, $localStorage){
  $scope.$emit('loadMainContainer', 'loaded');
  $scope.$storage = $localStorage;

  $scope.$on('cartChange', function(event, data) { 
    $scope.showPath = data; 
  });
  if (!$scope.showPath){
    $scope.showPath = $scope.$storage.pathCount;
  }


})






.controller('StoreAddressCtrl', function($scope, $state, $window, $timeout, $http, $location, $localStorage, ngCart, $rootScope, CurrentOrderService, moment){
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(247, 237, 245, 0)';

  $scope.$emit('loadMainContainer', 'loaded');
  $scope.$storage = $localStorage;
  $scope.cartItems = ngCart.getItems();

  $scope.$on('setShippable', function (event, data) {
    $scope.shipBool = data;
  });

 

  


  $rootScope.path = $location.$$path;
  console.log($location.$$path);
  if (!$scope.$storage.pathCount || $scope.$storage.pathCount < 1){
    $scope.$storage.pathCount = 0;
    $scope.$emit('cartChange', $scope.$storage.pathCount); 
  } 
  
  $scope.loaded = [];


  $scope.data = {
    "shipping": {
      "country": {}
    },
    "billing": {
      "country": {}
    }
  };
  $scope.mailingListAdd = true;
  $scope.shippingSameBool = false;


  // REQUESTS FOR JSON DATA FOR NG-OPTIONS

  $http.get('/js/JSON/countries.json').success (function(data){
        $scope.countries = data;
        $scope.data.shipping.country = $scope.countries[0];
        $scope.data.billing.country = $scope.countries[0];
        $scope.loaded.push("go");
  });

  $http.get('/js/JSON/states.json').success (function(data){
        $scope.states = data;
        $scope.loaded.push("go");
  });

  $http.get('/js/JSON/provinces.json').success (function(data){
        $scope.provinces = data;
        $scope.loaded.push("go");
  });



  $scope.isShippingSame = function(){
    if ($scope.data.shippingSame){
      $scope.data.billing = $scope.data.shipping;
      $scope.shippingSameBool = true;
    } else {
      $scope.data.billing = {};
      $scope.shippingSameBool = false;
    }
  }


  $scope.countryChange = function(country){
    if (country.code === 'US'){
      $scope.shippingType = $scope.shipRates.domestic;
    } else {
      $scope.shippingType = $scope.shipRates.international;
    }
  }

$scope.submitForm = function(form){
     if(form.$valid){
      
    $scope.loaded = [];
    setMailingList();
    var taxObj = {
      amount: ngCart.getTax(),
      description: "tax: ("+ ngCart.getTaxRate() + "%)",
    }
    var ship = $scope.data.shipping;
    var bill = $scope.data.billing; 
    $scope.$storage.billingAddress = $scope.data.billing;
    $scope.$storage.shippingAddress = $scope.data.shipping;
    var d = new Date();
    
      var req = {
        url: '/store/newOrder',
        method: 'POST',
        params: {
          order: {
            status: "pending",
            dateCreated: d.getTime(),
            currency: 'usd',
            items: $scope.cartItems,
            tax: taxObj,
            billing : {
              name: bill.name,
              email: bill.email,
              phone: bill.phone,
              address: {
                line1: bill.address1,
                line2: bill.address2 || null,
                city: bill.city,
                state: bill.stateProvince.short || null,
                country: bill.country.code,
                postal_code: bill.postalCode
              }
            },
            metadata: {
              taxRate: ngCart.getTaxRate()
            }
          }
        }
      } 

      if ($scope.shipBool){
        req.params.shippable = true;
        req.params.shipping = {
              name: ship.name,
              address: {
                line1: ship.address1,
                line2: ship.address2 || null,
                city: ship.city,
                state: ship.stateProvince.short || null,
                country: ship.country.code,
                postal_code: ship.postalCode
              }
        }
      } else {
        req.params.shippable = false;
      }

      var orderNumber = Math.floor(100000 + Math.random() * 1000000000);
      $scope.$storage.orderData = req.params.order;
      $scope.$storage.orderData.orderNumber = orderNumber;

      firebase.database().ref('orders/order_' + orderNumber).set(req.params.order);
      $http(req).then(function success(res) {
          console.log("success!!!", res);
          $scope.$storage.shippingData = res.data;
          $location.url('/store/checkout/payment');
        }, function error(res) {
          console.log("error ",res);             
      });

     } else {
       console.log("form invalid!");
     }
      
  }

    var setMailingList = function(){
      if ($scope.mailingListAdd === true){
        $scope.$storage.mailingList = true;
      } else {
        $scope.$storage.mailingList = false;
      }
    }



    $scope.getTaxRate = function(country, stateProvince, postalCode){
      console.log($scope.data);
      console.log(country, stateProvince, postalCode);
    if (country.code === 'US' && stateProvince.short === 'WA' && postalCode){
      if ($window.localStorage.currentWaRate){
        var parsedTax = parseFloat($window.localStorage.currentWaRate)
        ngCart.setTaxRate(parsedTax);    
      } else {
        var req = {
          url: '/taxRate',
          method: 'GET',
          params: {
            country: 'usa',
            postal: postalCode
          }
        } 

        $http(req).then(function success(res) {
          ngCart.setTaxRate(res.data.totalRate); 
          $window.localStorage.currentWaRate = res.data.totalRate; 
        }, function error(res) {
          console.log("error ",res);             
        });
      }
    } else if (country.code === 'US' && stateProvince.short !== 'WA'){
      ngCart.setTaxRate(0);
    } else if (country.code !== 'US'){
      ngCart.setTaxRate(0);
    }
  }





})



.controller('StorePaymentCtrl', 
  function($scope, $state, $http, $timeout, $location, $localStorage, 
  ngCart, $rootScope, currentOrder){

  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(247, 237, 245, 0)';
  $scope.$emit('loadMainContainer', 'loaded');
  console.log($location.$$path);
  $rootScope.path = $location.$$path;
  $scope.$storage = $localStorage;
  $scope.pathCount = parseInt($scope.$storage.pathCount); 
  $scope.data = {};


  $scope.$on('setShippable', function (event, data) {
    $scope.shipBool = data;
  });

  var orderNumber = $scope.$storage.orderData.orderNumber;
  var items = $scope.$storage.orderData.items;
  for (var i = 0; i < items.length; i++){
    if (items[i]._data.product_type === "ticket"){
      $scope.showWillCall = true;
    }
  }

  if ($scope.$storage.shippingData.rates_list){
     $scope.shipOptions = $scope.$storage.shippingData.rates_list;
    $scope.$storage.savedSelectedShip = $scope.$storage.shippingData.rates_list[0];

     for (var i = 0; i < $scope.shipOptions.length; i++){
    if ($scope.shipOptions[i].object_id === $scope.$storage.savedSelectedShip.object_id){
      $scope.selectedShip = $scope.shipOptions[i];
      break;
    }
  }

   $scope.$watch('selectedShip', function (newValue, oldValue, scope) {
     $scope.$storage.savedSelectedShip = $scope.selectedShip;
    ngCart.setShipping(($scope.selectedShip.amount * 100));  
  }, false);
  }

  $timeout(function(){
   $scope.loaded = true; 
  })

  
  
  $scope.submitForm = function(form){
    if(form.$valid){


      // THIS IS NOT WORKING!!!
      $scope.$storage.orderData.willCallName = $scope.data.willCallName;

      $scope.loaded = false; 
      Stripe.card.createToken({
        number: $scope.number,
        cvc: $scope.cvc,
        exp: $scope.expiry,
        name: $scope.$storage.billingAddress.name,
        address_line1: $scope.$storage.billingAddress.address1,
        address_line2: $scope.$storage.billingAddress.address2 || null,
        address_city: $scope.$storage.billingAddress.city,
        address_state: $scope.$storage.billingAddress.stateProvince.short || null,
        address_zip: $scope.$storage.billingAddress.postalCode,
        address_country: $scope.$storage.billingAddress.country.code
      }, function(err, token){
        if (err != 200){
          console.log("we have an error: ",err);
        }

        if (token){
          console.log("we have a token: ",token);
          $timeout(function(){ 
            $scope.$storage.tokenData = token;
            $location.url('/store/checkout/confirm'); 
          },1);
          
        }
      });
    } else {
      console.log("form invalid!!");
    }
  }
})


.controller('StoreConfirmCtrl', function($scope, $state, $http, $timeout, $location, $localStorage, ngCart, $rootScope, AllTickets, WillCallListService){

  $scope.$on('setShippable', function (event, data) {
    $scope.shipBool = data;
  });



var main = document.getElementById("main");
main.style.backgroundColor = 'rgba(247, 237, 245, 0)';
$scope.$emit('loadMainContainer', 'loaded');
$scope.$storage = $localStorage;
$scope.pathCount = parseInt($scope.$storage.pathCount); 
$scope.orderComplete = false;
$rootScope.path = $location.$$path;
console.log($location.$$path);
$scope.ngCart = ngCart;

var items = $scope.$storage.orderData.items;
var tickets = AllTickets;
var thisItemIndex;
console.log(items[0].parent);
console.log(tickets);







// referencing stuff from local storage (current shipping choice, token, shipping & billing address info)
$scope.currentShipping = $scope.$storage.savedSelectedShip;
$scope.token = $scope.$storage.tokenData;
$scope.shipping = $scope.$storage.shippingAddress;
$scope.billing = $scope.$storage.billingAddress;
$scope.order = $scope.$storage.orderData;

$timeout(function(){
  $scope.loaded = true;
})
  


var updateTicketCount = function(cartItems, itemIndex){
  console.log("entering updateTicketCount");
  var thisQuant = cartItems[itemIndex].quantity;
  var willCallArr = WillCallListService(cartItems[itemIndex].parent);
  willCallArr.$add({"name": $scope.$storage.orderData.willCallName, "quantity": thisQuant}).then(function(ref) {
    var id = ref.key;
    console.log("i where I want to do work should be " + itemIndex);
    var showCountRef = firebase.database().ref('tickets/'+ cartItems[itemIndex].parent + '/totalTickets');
    showCountRef.once('value').then(function(snapshot) {
      showCountRef.set(snapshot.val() - thisQuant);
    });
  }, function(err){
    console.log("what is err: ",err);
  });
}

var orderStatusDone = function(orderNumber) {
  firebase.database().ref('orders/order_' + orderNumber + '/status').set("complete");
}




$scope.createCharge = function(){
  $scope.loaded = false; 
       if ($scope.$storage.mailingList === true){
          console.log("should be adding to mailinglist!");
          mailchimpSubmit($scope.$storage.billingAddress.email);
      }

      var req = {
        url: '/store/orderComplete',
        method: 'POST',
        params: {
          totalAmount: ngCart.totalCost(),
          tax: ngCart.getTax(),
          token: $scope.token.id,
          name: $scope.token.card.name,
          cart: JSON.stringify(ngCart.getItems()),
          order: $scope.$storage.orderData,
          shipChoice: $scope.currentShipping
        }
      } 

      $http(req).then(function(res) {
        $scope.isError = false;
        for (var i = 0; i < items.length; i++){
          for (var j = 0; j < tickets.length; j++){
            if (tickets[j].$id === items[i].parent){
            updateTicketCount(items, i); 
            }
          }
        }
        orderStatusDone($scope.$storage.orderData.orderNumber);
        $scope.orderComplete = true;
       
        ngCart.setTaxRate();
        ngCart.setShipping();   
        ngCart.empty();
        $localStorage.$reset();
        localStorage.clear();
      }, function(res) {
        console.log("in the error callback!");
        $scope.errorMessage = res.data.message;
        $scope.isError = true;
        $scope.loaded = true;     
    //do something if the response has an error
    console.log("error ",res);
  });
}





var mailchimpSubmit = function(email){
    var url = "//sisterstheband.us14.list-manage.com/subscribe/post-json?u=bc38720b0bcc7a32641bb572c&amp;id=242f4adc89&EMAIL="+ email +"&c=JSON_CALLBACK"
    $http.jsonp(url).then(function success(res){
    }, function error(res){
      console.log(res);
    });
}





});