angular.module('SistersServices')

// Pulls images for Instagram preview
.service('InstagramFactory', ['$http', '$q', 
  function ($http, $q) {
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


// Pulls content for twitter post display
.service('TwitterFactory', ['$http', '$q', 
  function ($http, $q) {
    var deferred = $q.defer();
    $http({
        method: 'GET',
        url: '/twitter',
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
    var blogRef = firebase.database().ref('blog_posts').orderByChild("timestamp");
    return $firebaseArray(blogRef);
  }
}])


.factory("ThisPostService", ["$firebaseArray",
  function($firebaseArray){
    return function(slug){
      var postRef = firebase.database().ref('blog_posts');
      var thisPostRef = postRef.orderByChild('slug').equalTo(slug);
      return $firebaseArray(thisPostRef);
    }
  }
  ])

.factory("AllTagsService", ["$firebaseArray", 
  function($firebaseArray) {
  return function(){
      var tagRef = firebase.database().ref('tags');
      return $firebaseArray(tagRef);
  }
}])

.factory("TagsShowService", ["$firebaseArray", 
  function($firebaseObject) {
  return function(tagName){
      var tagRef = firebase.database().ref('tags');
      var tagShowRef = tagRef.orderByChild('name').equalTo(tagName);
      return $firebaseObject(tagShowRef);
  }
}])


.factory("ArchiveService", ["$firebaseArray", 
  function($firebaseArray){
    return {
      years: function(){
      var yearRef = firebase.database().ref('archives');
      return $firebaseArray(yearRef);
      },
      months: function(year){
      var monthRef = firebase.database().ref('archives/'+year);
      return $firebaseArray(monthRef);
      }
    }
}])

.factory("ArchiveShowService", ["$firebaseArray", 
  function($firebaseArray) {
  return function(year, month){
      var archiveRef = firebase.database().ref('archives/' + year + '/' + month);
      return $firebaseArray(archiveRef);
  }
}])