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

.factory('CurrentOrderService', function($window) {
 function set(data) {
   $window.localStorage.setItem( 'orderData', angular.toJson(data) );
  //  console.log("order saved!");
 }
 function get() {
  var order = angular.fromJson( $window.localStorage.getItem('orderData') ) ;
    return JSON.parse(order);
 }

 return {
  set: set,
  get: get
 }
})