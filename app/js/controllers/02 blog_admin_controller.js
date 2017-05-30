angular.module('SistersCtrls')



  .controller('NewBlogCtrl', ['$scope', '$state', '$http', 'Auth', 'BlogPosts', 'AllTags', 'HelperService', 'UploadImages', 'moment', 'BlogFactory', function ($scope, $state, $http, Auth, BlogPosts, AllTags, HelperService, UploadImages, moment, BlogFactory) {
    var main = document.getElementById("main");
    main.style.backgroundColor = 'rgba(0,0,0,0)';
    $scope.$emit('loadMainContainer', 'loaded');
    $scope.BlogPosts = BlogPosts();
    $scope.tags = AllTags;
    $scope.checkedTags = {};
    $scope.data = {};

    $scope.resetMedia = function () {
      $scope.data.youtube = "";
      $scope.data.flow = null;
    }

    $scope.submit = function () {
      var test = document.getElementById("new-blog-textarea").innerText;
      if ($scope.data.mediaSelect === 'image') {
        var date = new Date();
        UploadImages($scope.data.flow.files, "blog", date).then(function (resultImg) {
          console.log("what is result image? ", resultImg[0]);
          BlogFactory.addPost($scope.post, $scope.BlogPosts, resultImg[0], null, $scope.checkedTags);
        })
      } else if ($scope.data.mediaSelect === 'youtube') {
        $scope.data.youtube = HelperService.parseYouTube($scope.data.youtube);
        BlogFactory.addPost($scope.post, $scope.BlogPosts, null, $scope.data.youtube, $scope.checkedTags);
      }
    }

    $scope.addTag = function () {
      $scope.tags.$add({
        "name": $scope.data.newTag
      }).then(function (ref) {
        $scope.postId = ref.key;
        console.log("what is post id? ", ref.key);
        $scope.data.newTag = "";
      });
    }

    $scope.resizeImg = function (img) {
      var resize = HelperService.imgResize(img);
    }

    $scope.deleteTag = function (item) {
      $scope.tags.$remove(item).then(function (ref) {
        ref.key === item.$id; // true
      });
    }

  }])

  .controller('EditBlogCtrl', ['$scope', '$state', '$timeout', '$stateParams', 'SendDataService', 'AllTags', 'thisPost', 'HelperService', 'UploadImages', '$uibModal', '$log', 'BlogPosts', 'BlogFactory', 'FirebaseImgDownloader', function ($scope, $state, $timeout, $stateParams, SendDataService, AllTags, thisPost, HelperService, UploadImages, $uibModal, $log, BlogPosts, BlogFactory, FirebaseImgDownloader) {
    var main = document.getElementById("main");
    main.style.backgroundColor = 'rgba(0,0,0,0)';
    $scope.$emit('loadMainContainer', 'loaded');
    $scope.data = {};
    $scope.postArray = thisPost;
    $scope.post = thisPost[0];
    $scope.originalTags = angular.copy($scope.post.tags);
    $scope.tags = AllTags;

    if (!$scope.post.youtube) {
      FirebaseImgDownloader(thisPost[0]).then(function (imgResult) {
        var images = imgResult;
        if (images.length > 0) {
          console.log("images exist");
          var blob = images[0];
          console.log("flow: ", $scope.data.flow);
          $timeout(function () {
            $scope.data.flow.addFile(blob);
          })
        }
      }, function (error) {
        console.log("there is a problem!!!");
      })
    }



    if ($scope.post.youtube) {
      console.log($scope.post.youtube);
      var youtubeId = $scope.post.youtube
      $scope.data.youtube = "https://www.youtube.com/watch?v=" + youtubeId;
    }



    $scope.confirmBlogDelete = function (post) {
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


    $scope.addTag = function () {
      $scope.tags.$add({
        "name": $scope.data.newTag
      }).then(function (ref) {
        $scope.postId = ref.key;
        console.log("what is post id? ", ref.key);
        $scope.data.newTag = "";
      });
    }

    $scope.deleteTag = function (item) {
      $scope.tags.$remove(item).then(function (ref) {
        ref.key === item.$id; // true
      });
    }


    $scope.resetMedia = function () {
      $scope.data.youtube = "";
      $scope.data.flow = null;
    }

    $scope.submit = function () {
      if ($scope.data.mediaSelect === 'image') {
        console.log("what is flow? ", $scope.data.flow);
        // SubmitBlogImage($scope.post, $scope.postArray, $scope.data.flow, updatePost);
        UploadImages($scope.data.flow.files, "blog", null).then(function (resultImg) {
          console.log("what is result image? ", resultImg[0]);
          BlogFactory.updatePost($scope.post, thisPost, resultImg[0], null, $scope.originalTags);
        })
      } else if ($scope.data.mediaSelect === 'youtube') {
        $scope.data.youtube = HelperService.parseYouTube($scope.data.youtube);
        BlogFactory.updatePost($scope.post, thisPost, null, $scope.data.youtube, $scope.originalTags);
      }
    }

  }])


  .controller('EditBlogTagsCtrl', ["$scope", "$uibModalInstance", "tag", "Blog", function ($scope, $uibModalInstance, tag, Blog) {
    $scope.prompted = false;
    $scope.tag = angular.copy(tag);
    console.log(tag);
    $scope.ok = function (tag) {
      var newName = {
        name: $scope.tag.name
      };
      firebase.database().ref('/tags/' + $scope.tag.$id).update(newName);
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.deletePrompt = function () {
      $scope.prompted = true;
    }

    $scope.delete = function (response) {
      if (response === "no") {
        $scope.prompted = false;
      } else if (response === "yes") {
        firebase.database().ref('/tags/' + $scope.tag.$id).remove();
        for (var i = 0; i < Blog.length; i++) {
          var thisPostTags = Blog[i].tags;
          if (thisPostTags[$scope.tag.$id] === true) {
            thisPostTags[$scope.tag.$id] = null;
            firebase.database().ref('/blog_posts/' + Blog[i].$id + "/tags").update(thisPostTags);
          }
        };
        $uibModalInstance.close();
      }
    }

  }])


  .controller('DeleteBlogConfirmCtrl', ["$scope", "$uibModalInstance", "Post", "moment", "$location", function ($scope, $uibModalInstance, Post, moment, $location) {
    console.log(Post);

    $scope.yes = function () {
      var year = moment(Post.timestamp).format("YYYY");
      var month = moment(Post.timestamp).format("MMMM");
      console.log(month + " of " + year);
      firebase.database().ref('blog_posts/' + Post.$id).remove();
      firebase.database().ref('archives/' + year + '/' + month + '/' + Post.$id).remove();
      $uibModalInstance.close();
      $location.url('/blog');
    }

    $scope.no = function () {
      $uibModalInstance.dismiss('cancel');
    }

  }])