angular.module('SistersCtrls')


.controller('StoreCtrl', function($scope, $state, $http){
  $scope.selected = {};

  $scope.submitAddress = function(address){
    if ($scope.selected.country === 'US' || $scope.selected.country === 'CA'){
      address.stateProvince = $scope.selected.stateProvince.short;
    }
    address.country = $scope.selected.country.name;
    console.log("what is address object? ",address);
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










})


