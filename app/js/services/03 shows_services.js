angular.module('SistersServices')

// Pulls content for twitter post display
.service('BandsInTown', ['$http', '$q', 
  function ($http, $q) {
    var deferred = $q.defer();
    $http({
        method: 'GET',
        url: '/bandsintown',
        cache: true
    }).success(function (data) {
        deferred.resolve(data);
    }).error(function (msg) {
        deferred.reject(msg);
    });
    return deferred.promise;
}])

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

.factory("GetTicket", ["$firebaseObject", 
  function($firebaseObject){
    return function(key){
    var ticketRef = firebase.database().ref('tickets/'+key);
    return $firebaseObject(ticketRef);
  }
}])

.factory("WillCallListService", ["$firebaseArray", 
  function($firebaseArray){
    return function(key){
    var willCallRef = firebase.database().ref('tickets/'+ key + '/willCallList');
    return $firebaseArray(willCallRef);
  }
}])