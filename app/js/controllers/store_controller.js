angular.module('SistersCtrls')


.controller('StoreCtrl', function($scope, $state){
  $scope.items = [{
      id: 10001,
      name: "Drink Champagne LP",
      price: 20
    },
    {
      id: 10002,
      name: "Drink Champagne CD",
      price: 10
    },
    {
      id: 10003,
      name: "SISTERS Tank Top",
      price: 30
    },
    {
      id: 10004,
      name: "SISTERS T-Shirt",
      price: 30
    }
  ]

  $scope.item = {
      id: 10001,
      name: "Drink Champagne LP",
      price: 20
    }

  $scope.food = "pizza"

})


.controller('StoreCartCtrl', function($scope, $state){


})