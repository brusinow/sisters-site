angular.module('SistersCtrls')


.controller('StoreCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage, allProducts, Auth){
    var main = document.getElementById("main");
    main.style.backgroundColor = 'rgba(255,255,255,0)';
    main.style.width = '';
    main.style.padding = '';
    $scope.loaded = false;
    $scope.products = allProducts;

      $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
  });
    
    $scope.showProduct = function(id){
      $state.go('storeShow', {id:id});
    }

    $scope.addProduct = function(){
      $state.go('addProduct');
    }

    $scope.firstPrice = function(obj){
      for (var first in obj) break;
      return obj[first].price;
    }


    $timeout(function(){
        $scope.loaded = true;
        $scope.$emit('loadMainContainer', 'loaded'); 
    })
 
})

.controller('StoreCartCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage, $stateParams){
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(255,255,255,0)';

  $scope.errorMessage = $stateParams;
  console.log("message object: ",$scope.errorMessage);

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



.controller('StoreShowCtrl', function($scope, $rootScope, $stateParams, $state, $http, $timeout, $location, $sessionStorage, oneProduct){
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(252, 244, 247, 0)';
  main.style.width = '';
  main.style.padding = '';
  $scope.$emit('loadMainContainer', 'loaded');
  if (oneProduct.description){
    $scope.product = oneProduct;
    $scope.images = oneProduct.images;
    var currentActiveSrc = $scope.images[0];

    $scope.skus = $scope.product.variant.skus;

    var first = function(obj){
      for (var first in obj) break;
      console.log("what is first? ",first);
      return obj[first];
    }

    $scope.data = {
      "shippable": $scope.product.shippable,
      "ship_details": $scope.product.shipping || null
    };
    $scope.data.selected = first($scope.skus);

    $scope.areVariants = function(){
      var count = 0;
      for (prop in $scope.skus){
        count++;
      }
      if (count < 2){
        return false;
      } else {
        return true;
      }
    }


    var mainImg = document.querySelector(".main-product-photo img");
    mainImg.src = $scope.images[0];
  } else {
    $location.url('/store');
  }


$scope.isActiveImg = function(){
  if (this.img === currentActiveSrc){
    return true;
  } else {
    return false;
  }
}

$scope.whatSelected = function(){
  console.log($scope.data.selected);
  $rootScope.$broadcast('changeQ', $scope.data.selected);
}



$scope.changeActive = function(){
  currentActiveSrc = this.img;
  mainImg.src = this.img;
}

})






.controller('CheckoutTemplateCtrl', function($scope, $state, $http, $timeout, $location, $localStorage){
  $scope.$emit('loadMainContainer', 'loaded');
  $scope.$storage = $localStorage;

  $scope.$on('pathChange', function(event, data) { 
    $scope.path = data; 
  });

  $scope.$on('pathCountChange', function(event, data) { 
    $scope.pathCount = data; 
  });



})






.controller('StoreAddressCtrl', function($scope, $state, $window, $timeout, $http, $location, $localStorage, ngCart, $rootScope, moment, currentOrder, shipment){
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(247, 237, 245, 0)';
  $scope.$emit('loadMainContainer', 'loaded');
  $scope.$storage = $localStorage;
  $scope.cartItems = ngCart.getItems();
  // var billingAddress = currentOrder.data.billing.address;


  $scope.$on('setShippable', function (event, data) {
    $scope.shipBool = data;
    console.log("is it shippable???? ", data);
  });

  console.log("items in cart: ",ngCart.getCart().items);
  
  $scope.loaded = [];


  $scope.data = {
    "shipping": {
      "country": {}
    }
  };


  if (currentOrder.data.billing){
    $scope.data.billing = currentOrder.data.billing.address;
  } else {
    $scope.data.billing = {
      "country": {}
    }
    $scope.$storage.pathCount = 1;
    ngCart.setShipping(0);  
  }

  $scope.$emit('pathChange', $location.$$path); 
  $scope.$emit('pathCountChange', $scope.$storage.pathCount);
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
      $scope.data.shipping = $scope.data.billing;
      $scope.shippingSameBool = true;
      $scope.getTaxRate($scope.data.billing.country, $scope.data.billing.stateProvince, $scope.data.billing.postalCode)
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
    var ship = $scope.data.shipping;
    var bill = $scope.data.billing; 
    $scope.$storage.billingAddress = $scope.data.billing;
    $scope.$storage.shippingAddress = $scope.data.shipping;
    $scope.$storage.shipBool = $scope.shipBool;
      var req = {
        url: '/store/newOrder',
        method: 'POST',
        params: {
          order: {
            status: "pending",
            currency: 'usd',
            items: $scope.cartItems,
            totalItemsPrice: ngCart.getSubTotal(),
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
      console.log("items: ",req.params.order.items);

      if ($scope.shipBool === true){
        req.params.shippable = true;
        req.params.order.shipping = {
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

      console.log("what is req? ",req);

      $http(req).then(function success(res) {
        console.log("res: ",res);
          
          $scope.$storage.pathCount = 2;
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
      console.log(country, stateProvince, postalCode);
      if (country.code === 'US' && stateProvince.short === 'WA' && postalCode){
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
        }, function error(res) {
          console.log("error ",res);             
        });
      
    } else if (country.code === 'US' && stateProvince.short !== 'WA'){
      ngCart.setTaxRate(0);
    } else if (country.code !== 'US'){
      ngCart.setTaxRate(0);
    }
  }





})



.controller('StorePaymentCtrl', 
  function($scope, $state, $http, $timeout, $location, $localStorage, ngCart, $rootScope, currentOrder, shipment){

  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(247, 237, 245, 0)';
  $scope.$emit('loadMainContainer', 'loaded');
  $scope.$storage = $localStorage;
  $scope.$emit('pathChange', $location.$$path); 
  $scope.$emit('pathCountChange', $scope.$storage.pathCount);
  $scope.data = {};





  $scope.$on('setShippable', function (event, data) {
    console.log("ship bool data: ",data);
    $scope.shipBool = data;
  });

  var order = currentOrder.data;
  console.log("order: ",order);
  if (!order){
    // $location.url('/store/cart');
    $state.go("storeCart", { message: "Your current session has expired. Please start your checkout again.", messageType: "info" });
  } else {
      // var orderNumber = order.orderNumber;
      var items = order.items;
      for (var i = 0; i < items.length; i++){
        if (items[i]._data.product_type === "ticket"){
          $scope.showWillCall = true;
        }
      }
  }

  $scope.orderByPrice = function(item){
    return parseInt(item.amount);
};


  var shipmentData = shipment.data;
  console.log("shipment data: ",shipmentData);

  if (shipmentData.rates_list){
    $scope.shipOptions = shipmentData.rates_list;
    var minIndex;
    var minVal;
    for (var i = 0; i < $scope.shipOptions.length; i++){
      if (!minVal || $scope.shipOptions[i].amount < minVal){
        minVal = $scope.shipOptions[i].amount;
        minIndex = i;
      }
      if ($scope.$storage.savedSelectedShip !== undefined && $scope.shipOptions[i].object_id === $scope.$storage.savedSelectedShip.object_id){
        $scope.data.selectedShip = $scope.shipOptions[i];
      } 
    } 
    if (!$scope.data.selectedShip){
        $scope.$storage.savedSelectedShip = shipmentData.rates_list[minIndex];
        $scope.data.selectedShip = $scope.$storage.savedSelectedShip;
    } 
  }

 $scope.$watch('data.selectedShip', function (newValue, oldValue, scope) {
   console.log("entering watch");
      if ($scope.data.selectedShip){
          $scope.$storage.savedSelectedShip = $scope.data.selectedShip;
          ngCart.setShipping(($scope.data.selectedShip.amount * 100));  
      }
  }, false);
    $timeout(function(){
    $scope.loaded = true; 
  })

  
  
  $scope.submitForm = function (form) {
    if (form.$valid) {

      // $scope.$storage.orderData.willCallName = $scope.data.willCallName;

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
      }, function (err, token) {
        if (err != 200) {
          console.log("we have an error: ", err);
        }

        if (token) {
          $timeout(function () {
            console.log("what is token? ",token);
            $http.post('/store/saveToken', {token: token, willCallName: $scope.data.willCallName || null}).then(function(success){
              $scope.$storage.pathCount = 3;
              $scope.$emit('pathCountChange', $scope.$storage.pathCount);
              $location.url('/store/checkout/confirm');
            }, function(err){
              console.log("error: ",err);
            });
          }, 1);

        }
      });
    } else {
      console.log("form invalid!!");
    }
  }


})


.controller('StoreConfirmCtrl', function($scope, $state, $http, $timeout, $location, $localStorage, ngCart, $rootScope, currentOrder, shipment, currentToken){

  $scope.$on('setShippable', function (event, data) {
    $scope.shipBool = data;
  });



var main = document.getElementById("main");
main.style.backgroundColor = 'rgba(247, 237, 245, 0)';
$scope.$emit('loadMainContainer', 'loaded');
$scope.$storage = $localStorage;
$scope.orderComplete = false;

var order = currentOrder.data;
console.log("order: ",order);
if (!order){
  // $location.url('/store/cart');
  $state.go("storeCart", { message: "Your current session has expired. Please start your checkout again.", messageType: "info" });
} else {
    // var orderNumber = order.orderNumber;
    var items = order.items;
    for (var i = 0; i < items.length; i++){
      if (items[i]._data.product_type === "ticket"){
        $scope.showWillCall = true;
      }
    }
}
$scope.$emit('pathChange', $location.$$path); 
$scope.$emit('pathCountChange', $scope.$storage.pathCount);
$scope.ngCart = ngCart;


var thisItemIndex;

// referencing stuff from local storage (current shipping choice, token, shipping & billing address info)
$scope.currentShipping = $scope.$storage.savedSelectedShip;
console.log($scope.currentShipping);
$scope.token = currentToken.data;
$scope.shipping = order.shipping;
$scope.billing = order.billing;
$scope.order = order;

$timeout(function(){
  $scope.loaded = true;
})
  


// var updateTicketCount = function (cartItems, itemIndex) {
//   var thisQuant = cartItems[itemIndex].quantity;
//   var willCallArr = WillCallListService(cartItems[itemIndex].parent);
//   willCallArr.$add({ "name": $scope.$storage.orderData.willCallName, "quantity": thisQuant }).then(function (ref) {
//     var id = ref.key;
//     var showCountRef = firebase.database().ref('tickets/' + cartItems[itemIndex].parent + '/totalTickets');
//     showCountRef.once('value').then(function (snapshot) {
//       showCountRef.set(snapshot.val() - thisQuant);
//     });
//   }, function (err) {
//     console.log("what is err: ", err);
//   });
// }

    // for (var i = 0; i < items.length; i++) {
    //   for (var j = 0; j < tickets.length; j++) {
    //     if (tickets[j].$id === items[i].parent) {
    //       updateTicketCount(items, i);
    //     }
    //   }
    // }

function makeTicketObject(items){
    var ticketObj = {}
    for (var i = 0; i < items.length; i++) {
      if (items[i].product_type === 'ticket' && !ticketObj[items[i].parent]){
        ticketObj[items[i].parent] = items[i].quantity;
      } else if (items[i].product_type === 'ticket' && ticketObj[items[i].parent]){
        parseInt(ticketObj[items[i].parent]) += items[i].quantity;
      }
    }
    return ticketObj;
}


$scope.createCharge = function () {
  $scope.loaded = false;

  var req = {
    url: '/store/orderComplete',
    method: 'POST',
    params: {
      totalAmount: ngCart.totalCost(),
      tax: { 
        amount: ngCart.getTax(),
        description: "tax: ("+ ngCart.getTaxRate() + "%)"
      },
      token: $scope.token.id,
      name: $scope.token.card.name,
      cart: angular.toJson(ngCart.getItems()),
      shipChoice: $scope.currentShipping,
      ticketObj: makeTicketObject(ngCart.getItems())
    }
  }

  $http(req).then(function (res) {
    console.log(res);
    $scope.isError = false;

    if ($scope.$storage.mailingList === true) {
      mailchimpSubmit($scope.$storage.billingAddress.email);
    }
    $scope.orderComplete = true;
    $scope.$storage.pathCount = 0;
    $scope.$emit('pathCountChange', $scope.$storage.pathCount);
    ngCart.setTaxRate(null);
    ngCart.setShipping(null);
    ngCart.empty();
    $localStorage.$reset();
    localStorage.clear();
  }, function (res) {
    $scope.errorMessage = res.data.message;
    $scope.isError = true;
    $scope.loaded = true;
    //do something if the response has an error
    console.log("error ", res);
  });
}





  var mailchimpSubmit = function (email) {
    var url = "//sisterstheband.us14.list-manage.com/subscribe/post-json?u=bc38720b0bcc7a32641bb572c&amp;id=242f4adc89&EMAIL=" + email + "&c=JSON_CALLBACK"
    $http.jsonp(url).then(function success(res) {
    }, function error(res) {
      console.log(res);
    });
  }





});