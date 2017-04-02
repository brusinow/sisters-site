angular.module('SistersCtrls')



.controller('NewBlogCtrl', ['$scope', '$state','$http','Auth','BlogPosts','AllTags','HelperService','SubmitBlogImage','moment', function($scope, $state, $http, Auth, BlogPosts, AllTags, HelperService, SubmitBlogImage, moment){
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(0,0,0,0)';
  $scope.$emit('loadMainContainer', 'loaded');
  $scope.BlogPosts = BlogPosts();
  $scope.tags = AllTags;
  $scope.checkedTags = {};
  $scope.data = {};

  $scope.resetMedia = function(){
    $scope.data.youtube = "";
    $scope.data.image = "";
  }

  $scope.submit = function(){
    var test = document.getElementById("new-blog-textarea").innerText;
    if ($scope.data.mediaSelect === 'image'){
      SubmitBlogImage($scope.post, $scope.BlogPosts, $scope.data.image, addPost);
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

  $scope.resizeImg = function(img){
    var resize = HelperService.imgResize(img);
  }

  $scope.deleteTag = function(item){
    $scope.tags.$remove(item).then(function(ref) {
  ref.key === item.$id; // true
});
  }

  var addPost = function(post, postArray, img, youtube){
    var postDate = new Date().getTime();
    var slug = HelperService.slugify(post.title, postDate);
    var year = moment(postDate).format("YYYY");
    var month = moment(postDate).format("MMMM");

    var newTags = {};
    for (var prop in $scope.checkedTags){
        newTags[prop] = $scope.checkedTags[prop];
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
    
    console.log("thisPost: ",thisPost);
    postArray.$add(thisPost).then(function(ref){
      var key = ref.key;
      var archivePost = {
        key: key
      }
      firebase.database().ref('archives/' + year + '/' + month + '/' + key).set(archivePost);
      // for (prop in newTags){
      //   if (newTags[prop]){
      //   firebase.database().ref('tags/' + prop + '/posts/' + key).set(archivePost); 
      //   }
      // }
      $state.go('blog.main');
    });
  }
}])

.controller('EditBlogCtrl', ['$scope', '$state', '$timeout', '$stateParams','SendDataService','AllTags','thisPost','HelperService','SubmitBlogImage','$uibModal','$log','BlogPosts', function($scope, $state, $timeout, $stateParams, SendDataService, AllTags, thisPost, HelperService, SubmitBlogImage, $uibModal, $log, BlogPosts){
  var main = document.getElementById("main");
  main.style.backgroundColor = 'rgba(0,0,0,0)';
  $scope.$emit('loadMainContainer', 'loaded');
  $scope.data = {};
  $scope.postArray = thisPost;
  $scope.post = thisPost[0];
  $scope.originalTags = angular.copy($scope.post.tags);
  $scope.tags = AllTags;

  if ($scope.post.youtube){
    console.log($scope.post.youtube);
    var youtubeId = $scope.post.youtube
    $scope.data.youtube = "https://www.youtube.com/watch?v="+ youtubeId;
  }

  

  $scope.confirmBlogDelete = function(post) {
    var modalInstance = $uibModal.open({
      animation: true,
      backdrop: true,
      templateUrl: '/views/blog/deleteBlogConfirmModal.html',
      controller: 'DeleteBlogConfirmCtrl',
      size: 'sm',
      resolve: {
        "Post": post
      }
    });

    modalInstance.result.then(function () {
     console.log("submitted modal");
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }; 


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


  $scope.resetMedia = function(){
    $scope.data.youtube = "";
    $scope.data.image = "";
  }

  $scope.submit = function(){
    if ($scope.data.mediaSelect === 'image' && $scope.data.image){
      SubmitBlogImage($scope.post, $scope.postArray, $scope.data.image, updatePost);
    } else if ($scope.data.mediaSelect === 'image' && !$scope.data.image){
      updatePost($scope.post, $scope.BlogPosts, $scope.post.img, null);
    } else if ($scope.data.mediaSelect === 'youtube'){
      $scope.data.youtube = HelperService.parseYouTube($scope.data.youtube);
      updatePost($scope.post, $scope.BlogPosts, null, $scope.data.youtube);
    }
  }

  var updatePost = function(post, postArray, img, youtube){
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
    $scope.postArray.$save(post).then(function(ref) {
      var key = ref.key;
      firebase.database().ref('archives/' + year + '/' + month + '/' + key).remove();
      firebase.database().ref('archives/' + year + '/' + month + '/' + key).set(thisPost);
      for (prop in $scope.originalTags){
        if ($scope.originalTags[prop] === true){
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
}])  


.controller('EditBlogTagsCtrl', function ($scope, $uibModalInstance, tag, Blog) {
  $scope.prompted = false;
  $scope.tag = angular.copy(tag);
  console.log(tag);
  $scope.ok = function (tag) {
    var newName = {
      name: $scope.tag.name
    };
    firebase.database().ref('/tags/'+$scope.tag.$id).update(newName);
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.deletePrompt = function(){
    $scope.prompted = true;
  }

  $scope.delete = function(response){
    if (response === "no"){
      $scope.prompted = false;
    } else if (response === "yes"){
      firebase.database().ref('/tags/'+$scope.tag.$id).remove();
      for (var i = 0; i < Blog.length; i++){
        var thisPostTags = Blog[i].tags;
        if (thisPostTags[$scope.tag.$id] === true){
          thisPostTags[$scope.tag.$id] = null;
          firebase.database().ref('/blog_posts/'+Blog[i].$id+"/tags").update(thisPostTags);
        }
      };
      $uibModalInstance.close();
    } 
  }

})


.controller('DeleteBlogConfirmCtrl', function ($scope, $uibModalInstance, Post, moment, $location) {
console.log(Post);

$scope.yes = function(){
  var year = moment(Post.timestamp).format("YYYY");
  var month = moment(Post.timestamp).format("MMMM");
  console.log(month + " of "+year);
  firebase.database().ref('blog_posts/'+Post.$id).remove();
  firebase.database().ref('archives/' + year + '/' + month + '/' + Post.$id).remove();
  $uibModalInstance.close();
  $location.url('/blog');
}

$scope.no = function(){
   $uibModalInstance.dismiss('cancel');
}
  
})