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




 






})


.controller('StoreAddressCtrl', function($scope, $state, $http, $location, $sessionStorage, ngCart){
  $scope.storage = $sessionStorage;
  $scope.data = {
    "billing": {
      "country": {}
    }
  };

  $scope.shippingSameBool = false;


  // REQUESTS FOR JSON DATA FOR NG-OPTIONS

  $http.get('/js/JSON/countries.json').success (function(data){
        $scope.countries = data;
        console.log("what is first country? ",$scope.countries[0]);
        $scope.data.billing.country = $scope.countries[0];
  });

  $http.get('/js/JSON/states.json').success (function(data){
        $scope.states = data;
  });

  $http.get('/js/JSON/provinces.json').success (function(data){
        $scope.provinces = data;
  });



  $scope.isShippingSame = function(){
    if ($scope.data.shippingSame){
      $scope.data.shipping = $scope.data.billing;
      $scope.shippingSameBool = true;
    } else {
      $scope.data.shipping = {};
      $scope.shippingSameBool = false;
    }
  }




  $scope.submitAddress = function(data){

    $sessionStorage.addressData = data;
    console.log("what was saved? ",$sessionStorage.addressData)
    if ($sessionStorage.addressData.shipping.country.code === 'US'){
      var req = {
        url: '/taxRate',
        method: 'GET',
        params: {
          country: 'usa',
          postal: $sessionStorage.addressData.shipping.postalCode
        }
      } 

      $http(req).then(function success(res) {
        console.log("Success! ",res.data);
        ngCart.setTaxRate(res.data.totalRate);
        $sessionStorage.taxRate = ngCart.getTaxRate();
        $location.url('/store/payment');
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
          token: token
        }
      } 

      $http(req).then(function success(res) {
        console.log("Success! ",res.data);
       
      }, function error(res) {
    //do something if the response has an error
    console.log("error ",res);
  });

  }
  }




});