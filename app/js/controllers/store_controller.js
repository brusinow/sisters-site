angular.module('SistersCtrls')


.controller('StoreCtrl', function($scope, $state, $http, $location){
  $scope.selected = {};
  $scope.data = {};

  $scope.submitAddress = function(address){
    if ($scope.selected.country.code === 'US' || $scope.selected.country.code === 'CA'){
      address.stateProvince = $scope.selected.stateProvince.short;
    }
    address.country = $scope.selected.country.name;

    var req = {
    url: '/checkoutAddress',
    method: 'POST',
    params: {
      address: address,
    }
   } 

  $http(req).then(function success(res) {
    //do something with the response if successful
    $location.url('/store/payment');
  }, function error(res) {
    //do something if the response has an error
    console.log("error ",res);
  });
  }



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

  $http.get('/js/JSON/countries.json').success (function(data){
        $scope.countries = data;
  });

  $http.get('/js/JSON/states.json').success (function(data){
        $scope.states = data;
  });

  $http.get('/js/JSON/provinces.json').success (function(data){
        $scope.provinces = data;
  });

  $scope.submitForm = function(){
    Stripe.card.createToken({
    number: $scope.number,
    cvc: $scope.cvc,
    exp: $scope.exp,
    address_zip: $scope.address_zip
    }, handleStripe);
  }

  var handleStripe = function(status, response){
  if(response.error) {
    // there was an error. Fix it.
  } else {
    // got stripe token, now charge it or smt
    token = response.id
    console.log("what is token? ",token);
  }
  }






})


