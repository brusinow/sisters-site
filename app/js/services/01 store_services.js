angular.module('SistersServices')


// Service that returns Firebase Arrays of all items and single items. Most often referenced in app.js resolve objects.
.factory("ProductsService", ["$firebaseArray","$firebaseObject", function($firebaseArray, $firebaseObject){
  return {
    allProducts: function(){
      var allProductsRef = firebase.database().ref('products');
      return $firebaseArray(allProductsRef);
    },
    oneProduct: function(productId){
      var oneProductRef = firebase.database().ref('products/'+ productId);
      return $firebaseObject(oneProductRef);
    }
  }
}])

// .factory('CurrentOrderService', function($window) {
//  function set(data) {
//    $window.localStorage.setItem( 'orderData', angular.toJson(data) );
//   //  console.log("order saved!");
//  }
//  function get() {
//   var order = angular.fromJson( $window.localStorage.getItem('orderData') ) ;
//     return JSON.parse(order);
//  }

//  return {
//   set: set,
//   get: get
//  }
// })

// .factory('SessionService', ['$http', function($http){

//     var urlBase = '/storeAPI';
//     var dataFactory = {};

//     dataFactory.currentOrder = function () {
//         return $http.get(urlBase + '/' + 'currentOrder');
//     };

//     dataFactory.currentShipment = function () {
//         return $http.get(urlBase + '/' + 'currentShipment');
//     };

// return dataFactory;
// }])


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

// .factory('dataFactory', ['$http', function($http) {

//     var urlBase = '/api/customers';
//     var dataFactory = {};

//     dataFactory.getCustomers = function () {
//         return $http.get(urlBase);
//     };

//     dataFactory.getCustomer = function (id) {
//         return $http.get(urlBase + '/' + id);
//     };

//     dataFactory.insertCustomer = function (cust) {
//         return $http.post(urlBase, cust);
//     };

//     dataFactory.updateCustomer = function (cust) {
//         return $http.put(urlBase + '/' + cust.ID, cust)
//     };

//     dataFactory.deleteCustomer = function (id) {
//         return $http.delete(urlBase + '/' + id);
//     };

//     dataFactory.getOrders = function (id) {
//         return $http.get(urlBase + '/' + id + '/orders');
//     };

//     return dataFactory;
// }]);