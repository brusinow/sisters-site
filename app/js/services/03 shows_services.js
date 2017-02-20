angular.module('SistersServices')

.factory("GetShows", ["$firebaseArray","moment", 
  function($firebaseArray, moment){
    var currentDay = moment().unix();
    var calcDay = currentDay - 86400;
    // console.log("current day: ",currentDay);
    return function(){
    var showsRef = firebase.database().ref('shows').orderByChild("unix").startAt(calcDay);
    // console.log("I'm in GetShows");
    return $firebaseArray(showsRef);
  }
}])

.factory("GetSingleShow", ["$firebaseObject", 
  function($firebaseObject){
    return function(key){
    var showRef = firebase.database().ref('shows/'+key);
    return $firebaseObject(showRef);
  }
}])

.factory("GetAllTickets", ["$firebaseArray", 
  function($firebaseArray) {
  return function(){
    var ticketRef = firebase.database().ref('tickets');
    return $firebaseArray(ticketRef);
  }
}])

// .factory("GetTicket", ["$firebaseObject", 
//   function($firebaseObject){
//     return function(key){
//     var ticketRef = firebase.database().ref('tickets/'+key);
//     return $firebaseObject(ticketRef);
//   }
// }])

.factory("WillCallListService", ["$firebaseArray", 
  function($firebaseArray){
    return function(key){
    var willCallRef = firebase.database().ref('tickets/'+ key + '/willCallList');
    return $firebaseArray(willCallRef);
  }
}])