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


.service('InstagramFactory', ['$http', '$q', function ($http, $q) {
    var deferred = $q.defer();
    $http({
        method: 'GET',
        url: '/instagram',
        cache: true
    }).success(function (data) {
        deferred.resolve(data);
    }).error(function (msg) {
        deferred.reject(msg);
    });
    return deferred.promise;
}])

.factory("BlogPosts", ["$firebaseArray", 
  function($firebaseArray) {
  return function(){
      var chatRef = firebase.database().ref('blog_posts');
      return $firebaseArray(chatRef);
  }
}]);