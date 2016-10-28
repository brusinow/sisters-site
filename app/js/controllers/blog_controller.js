angular.module('SistersCtrls')

.controller('BlogCtrl', ['$scope', '$state','$http','$timeout','$location','$stateParams','Auth','Blog','HelperService','InstagramFactory','AllTagsService', function($scope, $state, $http, $timeout, $location, $stateParams, Auth, Blog, HelperService, InstagramFactory, AllTagsService){
  var main = document.getElementById("main");
  main.style.backgroundColor = '';
  
  $scope.$emit('loadMainContainer', 'loaded');
  $scope.allTags = AllTagsService();

  $scope.location = $location.$$path;
  // console.log("location: ",$scope.location);
  
  // $scope.photos = Instagram.data;
  InstagramFactory.then(function(data){
    // console.log("what is data? ",data);
    $scope.photos = data.data;
    $scope.loaded = true;
  })
  $scope.enable = true;
  $scope.parseTitle = HelperService.titleToURL;

  $scope.auth = Auth;
  $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;

  });
  $scope.allPosts = Blog;
  $scope.page = $stateParams.page || 0;
  $scope.pageUp = '/blog/' + (parseInt($scope.page) + 1);
  $scope.pageDown = '/blog/' + HelperService.pageDown($scope.page);
  $scope.length = Blog.length;
  $scope.first = HelperService.findFirst($scope.length, $scope.page);


  $scope.last = $scope.length - (4 * $scope.page);
  $scope.posts = Blog.slice($scope.first, $scope.last);

  

  $scope.editPost = function(slug){ 
    $location.url('/blog/edit/'+slug);
  }

  

}])


.controller('BlogArchiveCtrl', ['$scope', '$state','$timeout','$stateParams','$location', 'Blog','Archive','Auth','HelperService','AllTagsService', function($scope, $state, $timeout, $stateParams, $location, Blog, Archive, Auth, HelperService, AllTagsService){
   $scope.$emit('loadMainContainer', 'notLoaded');
   $scope.location = $location.$$path;
  $scope.allTags = AllTagsService();
  $scope.enable = true;
  // $scope.photos = Instagram.data;
  $scope.fullBlog = Blog;
  var result = [];
  for (var i = 0; i < Archive.length; i++){
    var key = Archive[i].$id;
    for (var j = 0; j < Blog.length; j++){
      var blogKey = Blog[j].$id;
      if (key === blogKey){
        result.push(Blog[j]);
      }
    }
  };
  $scope.allPosts = result; 
  $scope.params = $stateParams;


  $scope.parseTitle = HelperService.titleToURL;


  $scope.auth = Auth;
  $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;

  });
  $scope.page = $stateParams.page || 0;
  $scope.pageUp = '/blog/archives/' + $stateParams.year + '/' + $stateParams.month + '/' + (parseInt($scope.page) + 1);
  $scope.pageDown = '/blog/archives/' + $stateParams.year + '/' + $stateParams.month + '/' + HelperService.pageDown($scope.page);
  $scope.length = $scope.allPosts.length;
  $scope.first = HelperService.findFirst($scope.length, $scope.page);


  $scope.last = $scope.length - (4 * $scope.page);
  // console.log("Last: ",$scope.last);
  $scope.posts = $scope.allPosts.slice($scope.first, $scope.last);
  // console.log($scope.posts);

  $timeout(function(){
    $scope.$emit('loadMainContainer', 'loaded');    
    $scope.loaded = true;
  })

  $scope.editPost = function(post){
    var titleParsed = HelperService.titleToURL(post.postTitle);
    $location.url('/blog/edit/'+titleParsed);
  }
}]) 


.controller('BlogTagsCtrl', ['$scope', '$state','$stateParams','$location', '$timeout','Blog','TagsShow','Auth','HelperService','AllTagsService', function($scope, $state, $stateParams, $location, $timeout, Blog, TagsShow, Auth, HelperService, AllTagsService){
   $scope.$emit('loadMainContainer', 'notLoaded');
   $scope.location = $location.$$path;
  $scope.allTags = AllTagsService();
  $scope.enable = true;
  $scope.tagName = TagsShow[0].name;
  var thisTag = TagsShow[0].$id;
  var selectPosts = [];
  for (var i = 0; i < Blog.length; i++){
    var thisPostTags = Blog[i].tags;
    if (thisPostTags[thisTag]){
      selectPosts.push(Blog[i]);
    }
  };







  
  // var length = 0;
  // var i;
  // for (i in allPosts) {
  //   if (allPosts.hasOwnProperty(i)) {
  //       length++;
  //       selectPosts.push(allPosts[i]);
  //   }
  // }
  // $scope.parseTitle = HelperService.titleToURL;



  $scope.auth = Auth;
  $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;

  });
  $scope.page = $stateParams.page || 0;
  $scope.pageUp = '/blog/tags/' + $stateParams.tagName  + '/' + (parseInt($scope.page) + 1);
  $scope.pageDown = '/blog/tags/' + $stateParams.tagName + '/' + HelperService.pageDown($scope.page);
  $scope.length = length;
  $scope.first = HelperService.findFirst($scope.length, $scope.page);

  $scope.last = $scope.length - (4 * $scope.page);
  console.log("Last: ",$scope.last);
  $scope.posts = selectPosts.slice($scope.first, $scope.last);
  console.log($scope.posts);

  $timeout(function(){
    $scope.$emit('loadMainContainer', 'loaded');
    $scope.loaded = true;   
  })

  $scope.editPost = function(post){
    var titleParsed = HelperService.titleToURL(post.postTitle);
    $location.url('/blog/edit/'+titleParsed);
  }
}]) 


.controller('BlogShowCtrl', ['$scope', '$state','$stateParams','$location','$timeout','thisPost','Blog','AllTagsService', function($scope, $state, $stateParams, $location, $timeout, thisPost, Blog, AllTagsService){
 $scope.$emit('loadMainContainer', 'notLoaded');
 $scope.location = $location.$$path;
 $scope.allTags = AllTagsService();
 $scope.enable = false;
 $scope.recentPosts = Blog;
 console.log($scope.recentPosts);
 // $scope.photos = Instagram.data; 
 $scope.posts = thisPost;
 $scope.allPosts = thisPost;

  $timeout(function(){
    $scope.$emit('loadMainContainer', 'loaded');  
    $scope.loaded = true;
  })
}])  


.controller('BlogSidebarCtrl', ['$scope', '$state','$stateParams','$timeout','ArchiveService','AllTagsService','BlogPosts','HelperService','$uibModal','$log', function($scope, $state, $stateParams,$timeout, ArchiveService, AllTagsService, BlogPosts, HelperService, $uibModal, $log){
 
  $scope.recentPosts = BlogPosts();
  $scope.parseTitle = HelperService.titleToURL;
  $scope.years = ArchiveService.years();
  $scope.years.$loaded().then(function(){
  })

  $scope.allTags = AllTagsService();

  $scope.newBlogPost = function(){
    $state.go("blog-new");
  }

  $scope.editTag = function(tag){
    console.log("current tag is ",tag);
    // $state.go("blog-tags-edit");
  }

    $scope.editTag = function(tag) {
    // console.log(whichPage);
    // console.log(index);
    var modalInstance = $uibModal.open({
      animation: true,
      backdrop: true,
      templateUrl: '/views/blog/editTagsModal.html',
      controller: 'EditBlogTagsCtrl',
      size: 'lg',
      resolve: {
        "Blog": function(BlogPosts){
        return BlogPosts().$loaded();
        },   
        tag: tag
      }
    });

    modalInstance.result.then(function () {
     console.log("submitted modal");
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }; 

}]);