angular.module('SistersCtrls')


.controller('StoreCtrl', function($scope, $state, $http, $location, $sessionStorage){



    $http.get('/stripe/allProducts').success(function(data){
      $scope.products = data.data;
      console.log("what are products? ",$scope.products);
    })


  $scope.toCheckout = function(){
    $location.url('/store/checkout/address');
  }

  $scope.continue = function(){
    $location.url('/store');
  }
 






})






.controller('StoreAddressCtrl', function($scope, $state, $http, $location, $sessionStorage, ngCart, $rootScope){
  console.log("what is shipping? ",ngCart.getShipping());
  console.log("show me items: ",ngCart.getItems());
  $scope.cartItems = ngCart.getItems();
  $rootScope.path = $location.$$path;
  $scope.loaded = [];


  console.log("what is rootScope? ",$rootScope);


  $scope.data = {
    "shipping": {
      "country": {},
      "stateProvince": {
        "short": ''
      }
    },
    "billing": {
      "country": {},
      "stateProvince": {
        "short": ''
      }
    }
  };
  $scope.mailingListAdd = true;
  $scope.shippingSameBool = false;


  // REQUESTS FOR JSON DATA FOR NG-OPTIONS

  $http.get('/js/JSON/countries.json').success (function(data){
        $scope.countries = data;
        console.log("what is first country? ",$scope.countries[0]);
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


  // $scope.getTaxRate = function(country, stateProvince, postalCode){
  //   if (country.code === 'US' && stateProvince.short === 'WA' && postalCode){
  //     if ($sessionStorage.currentWaRate){
  //       ngCart.setTaxRate($sessionStorage.currentWaRate);    
  //     } else {

  //       console.log("in WA State!!!!!");
  //       var req = {
  //         url: '/taxRate',
  //         method: 'GET',
  //         params: {
  //           country: 'usa',
  //           postal: postalCode
  //         }
  //       } 

  //       $http(req).then(function success(res) {
  //         console.log("Success! ",res.data);
  //         ngCart.setTaxRate(res.data.totalRate); 
  //         $sessionStorage.currentWaRate = res.data.totalRate;   
  //       }, function error(res) {
  //         console.log("error ",res);             
  //       });
  //     }
  //   } else if (country.code === 'US' && stateProvince.short !== 'WA'){
  //     console.log("not in WA state");
  //     ngCart.setTaxRate(0);
  //   } else if (country.code !== 'US'){
  //     console.log("Outside US!!!!!!!");
  //     ngCart.setTaxRate(0);
  //   }
  // }




  $scope.countryChange = function(country){
    if (country.code === 'US'){
      $scope.shippingType = $scope.shipRates.domestic;
    } else {
      $scope.shippingType = $scope.shipRates.international;
    }
  }

$scope.submitForm = function(){
  var ship = $scope.data.shipping;
  var bill = $scope.data.billing; 
  var req = {
    url: '/stripe/createOrder',
    method: 'POST',
    params: {
      order: {
        currency: 'usd',
        items: $scope.cartItems,
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
        email: ship.email
      }
    }
  } 



        $http(req).then(function success(res) {
          if (res.data.status === 'created'){
          console.log("Success! ",res.data);
          $location.url('/store/checkout/payment'); 
        } else {
          console.log("ERROR!!!! ",res.data);
          $scope.errorMessage = res.data.message;
        }
          // ngCart.setTaxRate(res.data.totalRate); 
          // $sessionStorage.currentWaRate = res.data.totalRate;   
        }, function error(res) {
          console.log("error ",res);             
        });
  }
})



.controller('StorePaymentCtrl', function($scope, $state, $http, $location, $sessionStorage, ngCart, $rootScope){
  $rootScope.path = $location.$$path;
  $scope.loaded = true;
  $scope.submitForm = function(form){
    if(form.$valid){
      Stripe.card.createToken({
        number: $scope.number,
        cvc: $scope.cvc,
        exp: $scope.expiry,
        name: $scope.data.billing.name
      }, handleStripe);
    } else {
      console.log("form invalid!!");
    }
  }

  var handleStripe = function(status, response){
    if(response.error) {
    // there was an error. Fix it.
  } else {
    token = response;

    var req = {
      url: '/stripe/saveToken',
      method: 'POST',
      params: {
        token: token
      }
    }

    $http(req).then(function success(res) {
          console.log("Success! ",res.data);
          $location.url('/store/checkout/confirm'); 
          // ngCart.setTaxRate(res.data.totalRate); 
          // $sessionStorage.currentWaRate = res.data.totalRate;   
        }, function error(res) {
          console.log("error ",res);             
        });
  }
  }


  //   $scope.shipRates = {
  //   domestic: {
  //     regular: {
  //       price: 500,
  //       carrier: 'USPS',
  //       service: "USPS First Class Mail",
  //       type: "standard-domestic"
  //     },
  //     expedited: {
  //       price: 2000,
  //       carrier: "USPS",
  //       service: "USPS Priority Mail 2-Day",
  //       type: "expedited-domestic"
  //     }
  //   },
  //   international: {
  //     regular: {
  //       price: 1500,
  //       carrier: "Placeholder",
  //       service: "International Regular Option",
  //       type: "standard-international"
  //     },
  //     expedited: {
  //       price: 4000,
  //       carrier: "Placeholder",
  //       service: "International Fast Option",
  //       type: "expedited-international"
  //     }
  //   }
  // }


  // $scope.shippingType = $scope.shipRates.domestic; 
  // $scope.shipChoice = $scope.shippingType.regular;

  // $scope.$watch('shipChoice', function (newValue, oldValue, scope) {
  //   console.log("what is shipChoice? ",$scope.shipChoice);
  //   ngCart.setShipping($scope.shipChoice.price);  
  // }, false);

  // $scope.$watch('shippingType', function (newValue, oldValue, scope) {
  //   $scope.shipChoice = $scope.shippingType.regular; 
  // }, false);


})


.controller('StoreConfirmCtrl', function($scope, $state, $http, $location, $sessionStorage, ngCart, $rootScope){
$scope.orderComplete = false;
$rootScope.path = $location.$$path;
console.log("what is rootScope? ",$rootScope);
$scope.ngCart = ngCart;

$http.get('/orderConfirm').success (function(data){
  if (!data.stripeToken){
  $location.url('/store/cart'); 
  return; 
  }
  console.log("what is data? ",data);
  $scope.orderDetails = angular.fromJson(data.orderDetails);
  console.log("order details parsed: ",$scope.orderDetails);
  $scope.token = angular.fromJson(data.stripeToken);
  console.log("token parsed: ",$scope.token);
  $scope.loaded = true;
});

$scope.createCharge = function(){
  var req = {
        url: '/createCharge',
        method: 'POST',
        params: {
          total: $scope.orderDetails.total,
          token: $scope.token.id,
          name: $scope.orderDetails.name
        }
      } 

      $http(req).then(function success(res) {
        console.log("Success! ",res);
        $scope.orderComplete = true;
        ngCart.setTaxRate();
        ngCart.setShipping();   
        ngCart.empty();
      }, function error(res) {
    //do something if the response has an error
    console.log("error ",res);
  });
}





});