angular.module('SistersServices')

.factory("GetAllOrders", ["$firebaseArray", 
  function($firebaseArray) {
  return function(){
    var ordersRef = firebase.database().ref('orders');
    return $firebaseArray(ordersRef);
  }
}])


.factory("GetAllTickets", ["$firebaseArray","moment", 
  function($firebaseArray, moment) {
  var currentDay = moment().unix();
  var calcDay = currentDay - 86400;
  return function(){
    // var ticketsRef = firebase.database().ref('tickets').orderByChild("unix").startAt(calcDay);
    var ticketsRef = firebase.database().ref('tickets').orderByChild("unix");
    return $firebaseArray(ticketsRef);
  }
}])


.factory("GetSingleTicket", ["$firebaseObject", 
  function($firebaseObject) {
  return function(id){
    var thisTicketRef = firebase.database().ref('tickets/' + id);
    return $firebaseObject(thisTicketRef);
  }
}])


.factory("ReturnCompleteOrders", function(){
  return function(array){
    var newArray = [];
    for (var i = 0; i < array.length; i++){
      if (array[i].status === 'complete'){
        newArray.push(array[i]);
      }
    }
    return newArray;
  }
})

.factory("ReturnPendingOrders", function(){
  return function(array){
    var newArray = [];
    for (var i = 0; i < array.length; i++){
      if (array[i].status === 'pending'){
        newArray.push(array[i]);
      }
    }
    return newArray;
  }
})

.factory("ThisWillCall", ["$firebaseArray", 
  function($firebaseArray) {
  return function(key){
    var willCallRef = firebase.database().ref('tickets/' + key + '/willCallList');
    return $firebaseArray(willCallRef);
  }
}])

.factory("WillCallFormat", function(){
  return function(data, showTitle){
    var text = "";
    text += showTitle + "\n \n";
    for (var i = 0; i < data.length; i++){
      text += data[i].name;
      if (data[i].quantity > 1){
        text += ' +' + (data[i].quantity - 1) + '\n';
      } else {
        text += '\n';
      }
    }
    return text;
  }
})

.factory("WillCallToBlob", ["Blob","WillCallFormat", function(Blob, WillCallFormat){
  return function(data, showTitle){
    var text = WillCallFormat(data, showTitle);
    console.log(text);
    var myBlob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    return myBlob;
  }
}])


.factory('Variant', function() {
    // instantiate our initial object
    var Variant = function(id, sku, name, price, index, count){
      this.id = sku || null;
      this.parentId = id;
      this.variantName = name || "";
      this.price = price || ""; 
      this.index = index || 0; 
      this.count = count || 0
    }

    Variant.prototype.changeIndex = function(index){
      this.index = index;
    }

    Variant.prototype.changeProductId = function(id){
      this.parentId = id;
    }

    Variant.prototype.changeSku = function(sku){
      this.id = sku;
    }

    Variant.prototype.changeCount = function(count){
      this.count = count;
    }
    return Variant;
})
