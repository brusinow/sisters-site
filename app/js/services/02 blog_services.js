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

.factory("BlogFactory", ["HelperService", "moment","$state","$timeout", function(HelperService, moment, $state, $timeout){
  return {
    addPost: function(post, postArray, img, youtube, checkedTags){
      var postDate = new Date().getTime();
      var slug = HelperService.slugify(post.title, postDate);
      var year = moment(postDate).format("YYYY");
      var month = moment(postDate).format("MMMM");

      var newTags = {};
      for (var prop in checkedTags){
          newTags[prop] = checkedTags[prop];
      }
      var thisPost = {
        postTitle: post.title,
        slug: slug,
        postBody: post.postBody,
        youtube: youtube ? youtube : null,
        img: img ? img : null,
        tags: newTags,
        timestamp: postDate   
      };
    
      postArray.$add(thisPost).then(function(ref){
        var key = ref.key;
        var archivePost = {
          key: key
        } 
      firebase.database().ref('archives/' + year + '/' + month + '/' + key).set(archivePost);
      $state.go('blog.main');
    });
    },
    updatePost: function(post, postArray, img, youtube, originalTags){
      var slug = HelperService.slugify(post.postTitle, post.timestamp);
      console.log(slug);
      var year = moment(post.timestamp).format("YYYY");
      var month = moment(post.timestamp).format("MMMM");
      var newTags = {};
      for (var prop in post.tags){
        newTags[prop] = post.tags[prop];
      }
      post.slug = slug;
      post.tags = newTags;
      post.youtube = youtube ? youtube : null;
      post.img = img ? img : null;
      var thisPost = {
        postTitle: post.postTitle,
        slug: slug,
        postBody: post.postBody,
        youtube: post.youtube,
        img: post.img,
        tags: newTags,
        timestamp: post.timestamp   
      };
      postArray.$save(post).then(function(ref) {
      var key = ref.key;
      firebase.database().ref('archives/' + year + '/' + month + '/' + key).remove();
      firebase.database().ref('archives/' + year + '/' + month + '/' + key).set(thisPost);
      for (prop in originalTags){
        if (originalTags[prop] === true){
          var url = 'tags/' + prop + '/posts/' + key;
          firebase.database().ref(url).remove().then(function(message) {
          })
          .catch(function(error) {
            console.log("Remove failed: " + error.message)
          }); 
        } else {
          console.log(prop + " not a tag for old edit!")
        }
      }
      $timeout(function(){
       for (prop in thisPost.tags){
        if (thisPost.tags[prop] === true){
          firebase.database().ref('tags/' + prop + '/posts/' + key).set(thisPost);
        } else {
          console.log(prop + " not a tag for new edit!");
        }
      }
    },100)

      $state.go('blog.main');
    });
  } 
  }
}])