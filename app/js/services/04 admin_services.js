angular.module('SistersServices')

.factory("GetAllOrders", ["$firebaseArray", 
  function($firebaseArray) {
  return function(){
    var ordersRef = firebase.database().ref('orders');
    return $firebaseArray(ordersRef);
  }
}])