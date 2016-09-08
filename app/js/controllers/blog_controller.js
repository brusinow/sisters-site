angular.module('SistersCtrls')

.controller('BlogCtrl', ['$scope', '$state','$http','$timeout','$location','$stateParams','Auth','Blog','HelperService','InstagramFactory','AllTagsService', function($scope, $state, $http, $timeout, $location, $stateParams, Auth, Blog, HelperService, InstagramFactory, AllTagsService){
  $scope.allTags = AllTagsService();
  
  // $scope.photos = Instagram.data;
  InstagramFactory.then(function(data){
    console.log("what is data? ",data);
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


.controller('BlogArchiveCtrl', ['$scope', '$state','$timeout','$stateParams','Blog','Archive','Auth','HelperService','AllTagsService', function($scope, $state, $timeout, $stateParams, Blog, Archive, Auth, HelperService, AllTagsService){
  $scope.allTags = AllTagsService();
  $scope.enable = true;
  // $scope.photos = Instagram.data;
  $scope.fullBlog = Blog;
  $scope.allPosts = Archive; 


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
  console.log("Last: ",$scope.last);
  $scope.posts = $scope.allPosts.slice($scope.first, $scope.last);
  console.log($scope.posts);

  $timeout(function(){
    $scope.loaded = true;
  })

  $scope.editPost = function(post){
    var titleParsed = HelperService.titleToURL(post.postTitle);
    $location.url('/blog/edit/'+titleParsed);
  }
}]) 


.controller('BlogTagsCtrl', ['$scope', '$state','$stateParams','$timeout','Blog','TagsShow','Auth','HelperService','AllTagsService', function($scope, $state, $stateParams, $timeout, Blog, TagsShow, Auth, HelperService, AllTagsService){
  $scope.allTags = AllTagsService();
  $scope.enable = true;
  // $scope.photos = Instagram.data;
  var allPosts = TagsShow[0].posts;
  var selectPosts = [];
  var length = 0;
  var i;
  for (i in allPosts) {
    if (allPosts.hasOwnProperty(i)) {
        length++;
        selectPosts.push(allPosts[i]);
    }
  }
  console.log("what is selectPosts? ",selectPosts);
  console.log("what is length? ",length)
  $scope.parseTitle = HelperService.titleToURL;



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
    $scope.loaded = true;
  })

  $scope.editPost = function(post){
    var titleParsed = HelperService.titleToURL(post.postTitle);
    $location.url('/blog/edit/'+titleParsed);
  }
}]) 


.controller('BlogShowCtrl', ['$scope', '$state','$stateParams','$timeout','thisPost','Blog','AllTagsService', function($scope, $state, $stateParams, $timeout, thisPost, Blog, AllTagsService){
 $scope.allTags = AllTagsService();
 $scope.enable = false;
 $scope.recentPosts = Blog;
 console.log($scope.recentPosts);
 // $scope.photos = Instagram.data; 
 $scope.posts = thisPost;
 $scope.allPosts = thisPost;

  $timeout(function(){
    $scope.loaded = true;
  })
}])  


.controller('BlogSidebarCtrl', ['$scope', '$state','$stateParams','$timeout','ArchiveService','AllTagsService','BlogPosts','HelperService', function($scope, $state, $stateParams,$timeout, ArchiveService, AllTagsService, BlogPosts, HelperService){
 
  $scope.recentPosts = BlogPosts();
  $scope.parseTitle = HelperService.titleToURL;
  $scope.years = ArchiveService.years();
  $scope.years.$loaded().then(function(){
    console.log("YEARS!!!", $scope.years); 
  })

  $scope.allTags = AllTagsService();

  $scope.newBlogPost = function(){
    $state.go("blog-new");
  }

}]);