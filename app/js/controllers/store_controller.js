angular.module('SistersCtrls')


.controller('StoreCtrl', function($scope, $state, $http, $location, $sessionStorage){

  $scope.items = [{
      id: 10001,
      name: "Drink Champagne LP",
      description: "Scratch the box. Curl up and sleep on the freshly laundered towels playing with balls of wool sleep on keyboard. Sit on human cough furball. Cough furball leave hair everywhere, or knock over christmas tree loves cheeseburgers.",
      price: 20
    },
    {
      id: 10002,
      name: "Drink Champagne CD",
      description: "Scratch the box. Curl up and sleep on the freshly laundered towels playing with balls of wool sleep on keyboard. Sit on human cough furball. Cough furball leave hair everywhere, or knock over christmas tree loves cheeseburgers.",
      price: 10
    },
    {
      id: 10003,
      name: "SISTERS Tank Top",
      description: "Scratch the box. Curl up and sleep on the freshly laundered towels playing with balls of wool sleep on keyboard. Sit on human cough furball. Cough furball leave hair everywhere, or knock over christmas tree loves cheeseburgers.",
      price: 30
    },
    {
      id: 10004,
      name: "SISTERS T-Shirt",
      description: "Scratch the box. Curl up and sleep on the freshly laundered towels playing with balls of wool sleep on keyboard. Sit on human cough furball. Cough furball leave hair everywhere, or knock over christmas tree loves cheeseburgers.",
      price: 30
    }
  ]

  $scope.item = {
      id: 10001,
      name: "Drink Champagne LP",
      description: "Scratch the box. Curl up and sleep on the freshly laundered towels playing with balls of wool sleep on keyboard. Sit on human cough furball. Cough furball leave hair everywhere, or knock over christmas tree loves cheeseburgers.",
      price: 20
    }


  $scope.toCheckout = function(){
    $location.url('/store/checkout');
  }

 






})






.controller('StoreCheckoutCtrl', function($scope, $state, $http, $location, $sessionStorage, ngCart, $rootScope){
  $rootScope.path = $location.$$path;
  $scope.storage = $sessionStorage;
  $scope.loaded = [];


  console.log("what is rootScope? ",$rootScope);
  $scope.shipRates = {
    domestic: {
      regular: {
        price: 5,
        service: "USPS First Class Mail"
      },
      expedited: {
        price: 20,
        service: "USPS Priority Mail 2-Day"
      }
    },
    international: {
      regular: {
        price: 15,
        service: "International Regular Option"
      },
      expedited: {
        price: 40,
        service: "International Fast Option"
      }
    }
  }


  $scope.shippingType = $scope.shipRates.domestic; 
  $scope.shipChoice = $scope.shippingType.regular;

  $scope.$watch('shipChoice', function (newValue, oldValue, scope) {
    ngCart.setShipping($scope.shipChoice.price);  
  }, false);

  $scope.$watch('shippingType', function (newValue, oldValue, scope) {
    $scope.shipChoice = $scope.shippingType.regular; 
  }, false);

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


  $scope.getTaxRate = function(country, stateProvince, postalCode){
    if (country.code === 'US' && stateProvince.short === 'WA' && postalCode){
      if ($sessionStorage.currentWaRate){
        ngCart.setTaxRate($sessionStorage.currentWaRate);    
      } else {

        console.log("in WA State!!!!!");
        var req = {
          url: '/taxRate',
          method: 'GET',
          params: {
            country: 'usa',
            postal: postalCode
          }
        } 

        $http(req).then(function success(res) {
          console.log("Success! ",res.data);
          ngCart.setTaxRate(res.data.totalRate); 
          $sessionStorage.currentWaRate = res.data.totalRate;   
        }, function error(res) {
          console.log("error ",res);             
        });
      }
    } else if (country.code === 'US' && stateProvince.short !== 'WA'){
      console.log("not in WA state");
      ngCart.setTaxRate(0);
    } else if (country.code !== 'US'){
      console.log("Outside US!!!!!!!");
      ngCart.setTaxRate(0);
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
    // got stripe token, now charge it or smt
    token = response;

    var orderDetails = {
      items: ngCart.getItems(),
      subTotal: ngCart.getSubTotal(),
      total: ngCart.totalCost(),
      taxRate: ngCart.getTaxRate(),
      taxTotal: ngCart.getTax(),
      shippingPrice: ngCart.getShipping(),
      shippingInfo: $scope.shipChoice,
      shippingAddress: $scope.data.shipping,
      billingAddress: $scope.data.billing
    }
     var req = {
        url: '/submitOrder',
        method: 'POST',
        params: {
          token: token,
          orderDetails: orderDetails
        }
      } 

      $http(req).then(function success(res) {
        $location.url('/store/confirm');
      }, function error(res) {
    //do something if the response has an error
    console.log("error ",res);
  });

  }
  }



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