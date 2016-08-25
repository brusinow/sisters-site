angular.module('SistersCtrls')



.controller('NewBlogCtrl', ['$scope', '$state','$http','Auth','BlogPosts','AllTags','HelperService','SubmitImage','moment', function($scope, $state, $http, Auth, BlogPosts, AllTags, HelperService, SubmitImage, moment){

  $scope.BlogPosts = BlogPosts();
  $scope.tags = AllTags;
  $scope.checkedTags = {};

  $scope.resetMedia = function(){
    $scope.data.youtube = "";
    $scope.data.image = "";
  }

  $scope.submit = function(){
    if ($scope.data.mediaSelect === 'image'){
      SubmitImage($scope.post, $scope.BlogPosts, $scope.data.image, addPost);
    } else if ($scope.data.mediaSelect === 'youtube'){
      $scope.data.youtube = HelperService.parseYouTube($scope.data.youtube);
      addPost($scope.post, $scope.BlogPosts, null, $scope.data.youtube);
    }
  }

  $scope.addTag = function(){
    $scope.tags.$add({
      "name": $scope.data.newTag
    }).then(function(ref){
      $scope.postId = ref.key;
      console.log("what is post id? ",ref.key);
      $scope.data.newTag = "";
    });
  }

  $scope.deleteTag = function(item){
    $scope.tags.$remove(item).then(function(ref) {
  ref.key === item.$id; // true
});
  }

  var addPost = function(post, postArray, img, youtube){
    console.log("IN ADD POST!!!!!!!!!!!!");
    var postDate = new Date().getTime();
    var year = moment(postDate).format("YYYY");
    var month = moment(postDate).format("MMMM");
    console.log(post.tags);

    var newTags = {};
    for (var prop in $scope.checkedTags){
        newTags[prop] = $scope.checkedTags[prop];
    }
    console.log("what are new tags? ",newTags)
    var thisPost = {
      postTitle: post.title,
      postBody: post.body,
      youtube: youtube ? youtube : null,
      img: img ? img : null,
      tags: newTags,
      timestamp: postDate   
    };
    console.log("thisPost: ",thisPost);
    postArray.$add(thisPost).then(function(ref){
      var key = ref.key;
      firebase.database().ref('archives/' + year + '/' + month + '/' + key).set(thisPost);
      for (prop in newTags){
        if (newTags[prop]){
        firebase.database().ref('tags/' + prop + '/posts/' + key).set(thisPost); 
        }
      }
      $state.go('blog');
    });
  }
}])





.controller('EditBlogCtrl', ['$scope', '$state', '$timeout', '$stateParams','SendDataService','AllTags','thisPost','HelperService','SubmitImage', function($scope, $state, $timeout, $stateParams, SendDataService, AllTags, thisPost, HelperService, SubmitImage){
  $scope.data = {};
  $scope.changeImage = false;

  
  $scope.postArray = thisPost;
  $scope.post = thisPost[0];
  $scope.originalTags = angular.copy($scope.post.tags);
  console.log($scope.post);
  console.log("what are original tags? ",$scope.originalTags);
  $scope.tags = AllTags;

  console.log("what are all tags? ",$scope.tags)
  if ($scope.post.youtube){
    console.log($scope.post.youtube);
    var youtubeId = $scope.post.youtube
    $scope.data.youtube = "https://www.youtube.com/watch?v="+ youtubeId;
  }


  $scope.addTag = function(){
    $scope.tags.$add({
      "name": $scope.data.newTag
    }).then(function(ref){
      $scope.postId = ref.key;
      console.log("what is post id? ",ref.key);
      $scope.data.newTag = "";
    });
  }

  $scope.deleteTag = function(item){
    $scope.tags.$remove(item).then(function(ref) {
  ref.key === item.$id; // true
});
  }

  $scope.toggleImage = function(){
    $scope.changeImage = !$scope.changeImage;
  }

  $scope.resetMedia = function(){
    $scope.data.youtube = "";
    $scope.data.image = "";
  }

  $scope.submit = function(){
    if ($scope.data.mediaSelect === 'image' && $scope.changeImage){
      SubmitImage($scope.post, $scope.postArray, $scope.data.image, updatePost);
    } else if ($scope.data.mediaSelect === 'image' && !$scope.changeImage){
      updatePost($scope.post, $scope.BlogPosts, $scope.post.img, null);
    } else if ($scope.data.mediaSelect === 'youtube'){
      $scope.data.youtube = HelperService.parseYouTube($scope.data.youtube);
      updatePost($scope.post, $scope.BlogPosts, null, $scope.data.youtube);
    }
  }

  var updatePost = function(post, postArray, img, youtube){
    var year = moment(post.timestamp).format("YYYY");
    var month = moment(post.timestamp).format("MMMM");
    var newTags = {};
    for (var prop in post.tags){
      newTags[prop] = post.tags[prop];
    }
    post.tags = newTags;
    post.youtube = youtube ? youtube : null;
    post.img = img ? img : null;
    console.log(post);
    var thisPost = {
      postTitle: post.postTitle,
      postBody: post.postBody,
      youtube: post.youtube,
      img: post.img,
      tags: newTags,
      timestamp: post.timestamp   
    };
    console.log("what is thisPost? ",thisPost);

    $scope.postArray.$save(post).then(function(ref) {
      var key = ref.key;
      firebase.database().ref('archives/' + year + '/' + month + '/' + key).remove();
      firebase.database().ref('archives/' + year + '/' + month + '/' + key).set(thisPost);
      console.log("TAGS BEFORE CHANGES: ",$scope.originalTags);
      console.log("TAGS AFTER CHANGES: ",thisPost.tags);
      for (prop in $scope.originalTags){
        if ($scope.originalTags[prop] === true){
          console.log("at ",prop);
          console.log("key is ",key);
          var url = 'tags/' + prop + '/posts/' + key;
          console.log("what is url? ",url)
          firebase.database().ref(url).remove().then(function(message) {
            console.log("Remove succeeded.",message);
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
          console.log("should be added");
        } else {
          console.log(prop + " not a tag for new edit!");
        }
      }
    },100)

      $state.go('blog');
    });
  }
  

  // $scope.updatePost = function(post){
  //   var year = moment(post.timestamp).format("YYYY");
  //   var month = moment(post.timestamp).format("MMMM");
  //   if ($scope.data.mediaSelect === "youtube"){
  //     $scope.post.youtube = HelperService.parseYouTube($scope.data.youtube);
  //   } else if ($scope.data.mediaSelect === "image"){

  //   }
  //   var newTags = {};
  //   for (var prop in post.tags){
  //     newTags[prop] = post.tags[prop];
  //   }
  //   post.tags = newTags;
  //   console.log(post);
  //   var thisPost = {
  //     postTitle: post.postTitle,
  //     postBody: post.postBody,
  //     youtube: post.youtube ? post.youtube : null,
  //     img: post.img ? post.img : null,
  //     tags: newTags,
  //     timestamp: post.timestamp   
  //   };
    
  //   $scope.postArray.$save(post).then(function(ref) {
  //     var key = ref.key;
  //     firebase.database().ref('archives/' + year + '/' + month + '/' + key).remove();
  //     firebase.database().ref('archives/' + year + '/' + month + '/' + key).set(thisPost);
  //     console.log("TAGS BEFORE CHANGES: ",$scope.originalTags);
  //     console.log("TAGS AFTER CHANGES: ",thisPost.tags);
  //     for (prop in $scope.originalTags){
  //       if ($scope.originalTags[prop] === true){
  //         console.log("at ",prop);
  //         console.log("key is ",key);
  //         var url = 'tags/' + prop + '/posts/' + key;
  //         console.log("what is url? ",url)
  //         firebase.database().ref(url).remove().then(function(message) {
  //           console.log("Remove succeeded.",message);
  //         })
  //           .catch(function(error) {
  //           console.log("Remove failed: " + error.message)
  //         }); 
  //       } else {
  //         console.log(prop + " not a tag for old edit!")
  //       }
  //     }
  //     $timeout(function(){
  //      for (prop in thisPost.tags){
  //       if (thisPost.tags[prop] === true){
  //         firebase.database().ref('tags/' + prop + '/posts/' + key).set(thisPost);
  //         console.log("should be added");
  //         } else {
  //           console.log(prop + " not a tag for new edit!");
  //         }
  //     }
  //     },100)
     
  //     $state.go('blog');
  //   });
  // }


}])  