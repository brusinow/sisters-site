angular.module('SistersServices', ['ngResource'])


.factory('LoadedService', function() {
 var loaded = false;
 function set(data) {
   loaded = data;
 }
 function get() {
  return loaded;
 }

 return {
  set: set,
  get: get
 }

})

.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
])

.factory("GetShows", ["$firebaseArray", 
  function($firebaseArray){
    return function(){
    var showsRef = firebase.database().ref('shows').orderByChild("unix");
    console.log("I'm in GetShows");
    return $firebaseArray(showsRef);
  }
}])
