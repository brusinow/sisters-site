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


.controller('StoreCheckoutCtrl', function($scope, $state, $http, $location, $sessionStorage, ngCart){
  $scope.storage = $sessionStorage;
  $scope.data = {
    "shipping": {
      "country": {}
    }
  };
  $scope.mailingListAdd = true;
  $scope.shippingSameBool = false;


  // REQUESTS FOR JSON DATA FOR NG-OPTIONS

  $http.get('/js/JSON/countries.json').success (function(data){
        $scope.countries = data;
        console.log("what is first country? ",$scope.countries[0]);
        $scope.data.shipping.country = $scope.countries[0];
  });

  $http.get('/js/JSON/states.json').success (function(data){
        $scope.states = data;
  });

  $http.get('/js/JSON/provinces.json').success (function(data){
        $scope.provinces = data;
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
       if (country.code === 'US' && stateProvince.short === 'WA'){
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
        ngCart.setShipping(5);   
      }, function error(res) {
    //do something if the response has an error
    console.log("error ",res);
  });
    } else if ($sessionStorage.addressData.shipping.country.code === 'US' && $sessionStorage.addressData.shipping.stateProvince.short != 'WA'){
      console.log("not in WA state");
      ngCart.setTaxRate(0);
      ngCart.setShipping(5); 
    }
  }




  $scope.submitForm = function(){
    Stripe.card.createToken({
    number: $scope.number,
    cvc: $scope.cvc,
    exp: $scope.expiry
    }, handleStripe);
  }



 var handleStripe = function(status, response){
  if(response.error) {
    // there was an error. Fix it.
  } else {
    // got stripe token, now charge it or smt
    token = response.id
     var req = {
        url: '/submitOrder',
        method: 'POST',
        params: {
          token: token,
          items: ngCart.getItems(),
          subTotal: ngCart.getSubTotal(),
          total: ngCart.totalCost(),
          taxRate: ngCart.getTaxRate(),
          taxTotal: ngCart.getTax(),
          shipping: ngCart.getShipping(),
          shippingAddress: $scope.data.shipping,
          billingAddress: $scope.data.billing
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


.controller('StorePaymentCtrl', function($scope, $state, $http, $location, $sessionStorage, ngCart){


 
  $scope.submitForm = function(){
    console.log("number is ",$scope.number);
    console.log("cvc is ",$scope.cvc);
    console.log("exp is ",$scope.expiry);

    Stripe.card.createToken({
    number: $scope.number,
    cvc: $scope.cvc,
    exp: $scope.expiry
    }, handleStripe);
  }



 var handleStripe = function(status, response){
  if(response.error) {
    // there was an error. Fix it.
  } else {
    // got stripe token, now charge it or smt
    token = response.id
    console.log("what is token? ",token);
     var req = {
        url: '/cardToken',
        method: 'POST',
        params: {
          token: token,
          total: ngCart.totalCost()
        }
      } 

      $http(req).then(function success(res) {
        console.log("Success! ",res.data);
        $location.url('/store/confirm');
      }, function error(res) {
    //do something if the response has an error
    console.log("error ",res);
  });

  }
  }




})

.controller('StoreConfirmCtrl', function($scope, $state, $http, $location, $sessionStorage, ngCart){

console.log("What is tax rate? ",ngCart.getTaxRate());





});