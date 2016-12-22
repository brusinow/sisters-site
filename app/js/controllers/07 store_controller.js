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

    $scope.editProduct = function(product){
      console.log("this product! ",product);
    }

    $timeout(function(){
        $scope.loaded = true;
        $scope.$emit('loadMainContainer', 'loaded'); 
    })
 
})

.controller('StoreCartCtrl', function($scope, $state, $http, $timeout, $location, $sessionStorage){
  var main = document.getElementById("main");
  main.style.backgroundColor = '';
  $scope.$emit('loadMainContainer', 'loaded');

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
    var taxObj = {
      amount: ngCart.getTax(),
      description: "tax: ("+ ngCart.getTaxRate() + "%)",
    }
    var ship = $scope.data.shipping;
    var bill = $scope.data.billing; 
    $scope.$storage.billingAddress = $scope.data.billing;
    $scope.$storage.shippingAddress = $scope.data.shipping;
    if ($scope.shipBool){
      var req = {
        url: '/store/newOrder',
        method: 'POST',
        params: {
          order: {
            dateCreated: moment(),
            currency: 'usd',
            items: $scope.cartItems,
            tax: taxObj,
            billing : {
              name: bill.name,
              email: ship.email,
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
            shipping: {
              name: ship.name,
              address: {
                line1: ship.address1,
                line2: ship.address2 || null,
                city: ship.city,
                state: ship.stateProvince.short || null,
                country: ship.country.code,
                postal_code: ship.postalCode
              }
            },
            metadata: {
              taxRate: ngCart.getTaxRate()
            }
          }
        }
      } 


      $http(req).then(function success(res) {
          console.log("success!!!", res);
          $scope.$storage.shippingData = res.data;
          $location.url('/store/checkout/payment');
        }, function error(res) {
          console.log("error ",res);             
      });



    } else {

          var order= {
            dateCreated: moment(),
            currency: 'usd',
            items: $scope.cartItems,
            tax: taxObj,
            billing : {
              name: bill.name,
              email: ship.email,
              phone: bill.phone,
              address: {
                line1: bill.address1,
                line2: bill.address2 || null,
                city: bill.city,
                state: bill.stateProvince.short || null,
                country: bill.country.code,
                postal_code: bill.postalCode
              }
            }
          }
            $location.url('/store/checkout/payment');

        }

     } else {
       console.log("form invalid!");
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
  $rootScope.path = $location.$$path;
  $scope.$storage = $localStorage;
  $scope.pathCount = parseInt($scope.$storage.pathCount); 

  $scope.$on('setShippable', function (event, data) {
    $scope.shipBool = data;
  });

  if ($scope.$storage.shippingData){
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
    // if(form.$valid){
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
    // } else {
      // console.log("form invalid!!");
    // }
  }
})


.controller('StoreConfirmCtrl', function($scope, $state, $http, $timeout, $location, $localStorage, ngCart, $rootScope){

Email.send("brusinow@gmail.com",
"rusinowmusic@gmail.com",
"This is a subject test",
"this is the body of information about stuff.",
{token: "d5a3661f-c28a-41c4-a7a2-586d3e9cb3c1"});

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
$scope.ngCart = ngCart;

// referencing stuff from local storage (current shipping choice, token, shipping & billing address info)
$scope.currentShipping = $scope.$storage.savedSelectedShip;
$scope.token = $scope.$storage.tokenData;
$scope.shipping = $scope.$storage.shippingAddress;
$scope.billing = $scope.$storage.billingAddress;

$timeout(function(){
  $scope.loaded = true;
})
  


$scope.createCharge = function(){
  $scope.loaded = false; 
      var req = {
        url: '/store/orderComplete',
        method: 'POST',
        params: {
          totalAmount: ngCart.totalCost(),
          token: $scope.token.id,
          name: $scope.token.card.name,
          cart: ngCart.getItems(),
          shipChoice: $scope.currentShipping
        }
      } 

      console.log(req.params.cart);

      $http(req).then(function success(res) {
        console.log("what is res? ",res);
        $scope.orderComplete = true;
        if ($scope.$storage.mailingList){
          mailchimpSubmit();
        }
        ngCart.setTaxRate();
        ngCart.setShipping();   
        ngCart.empty();
        $localStorage.$reset();
        localStorage.clear();
      }, function error(res) {
        $scope.loaded = true; 
    //do something if the response has an error
    console.log("error ",res);
  });
}





var mailchimpSubmit = function(){
    var url = "//sisterstheband.us14.list-manage.com/subscribe/post-json?u=bc38720b0bcc7a32641bb572c&amp;id=242f4adc89&EMAIL="+$scope.$storage.shippingData.email+"&c=JSON_CALLBACK"
    $http.jsonp(url).then(function success(res){
    }, function error(res){
      console.log(res);
    });
}





});