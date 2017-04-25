angular.module('SistersServices')


// Service that returns Firebase Arrays of all items and single items. Most often referenced in app.js resolve objects.
.factory("ProductsService", ["$firebaseArray","$firebaseObject", function($firebaseArray, $firebaseObject){
  return {
    allProducts: function(){
      var allProductsRef = firebase.database().ref('products');
      return $firebaseArray(allProductsRef);
    },
    allActiveProducts: function(){
    var allProductsRef = firebase.database().ref('products');
    var query = allProductsRef.orderByChild("active").equalTo(true);
      return $firebaseArray(query);
    },
    oneProduct: function(productId){
      console.log("in the service? ",productId);
      var oneProductRef = firebase.database().ref('products/'+ productId);
      return $firebaseObject(oneProductRef);
    }
  }
}])

.service('ThisOrderService', ['$http', '$q', 
  function ($http, $q) {
    var deferred = $q.defer();
    $http({
        method: 'GET',
        url: '/storeAPI/order',
        cache: true
    }).success(function (data) {
        deferred.resolve(data);
    }).error(function (msg) {
        deferred.reject(msg);
    });
    console.log("what is deferred.promise? ",deferred.promise);
    return deferred.promise;
}])



.factory('ticketFactory', ['$http', function($http){
    var urlBase = '/ticketAPI/ticket';
    var ticketFactory = {};

    ticketFactory.getTicket = function(id) {
      var req = {
      method: 'GET',
      url: urlBase,
      params: { id: id }
      }
        return $http(req);
    };
    return ticketFactory;
}])

