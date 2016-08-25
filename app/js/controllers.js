angular.module('SistersCtrls', ['SistersServices'])

.controller('HomeCtrl', ['$scope', '$state','$timeout','LoadedService', function($scope, $state, $timeout, LoadedService) {
  $scope.loaded = LoadedService.get();
  console.log("what is loaded? ",$scope.loaded);
  var width = window.innerWidth;
  console.log("inner width: ",width);

  if (!$scope.loaded && width > 806){ 
    $timeout(function () {
      console.log("fade in home!!!!");
      $scope.fadeHome = true;
      LoadedService.set(true);
    }, 600);
  } else {
    $scope.fadeHome = true;
    LoadedService.set(true);
  } 
}])

.controller('AboutCtrl', function($scope, $state){

}) 


.controller('BlogCtrl', ['$scope', '$state','$http','$location','$stateParams','Auth','Blog','HelperService','Instagram','AllTagsService', function($scope, $state, $http, $location, $stateParams, Auth, Blog, HelperService, Instagram, AllTagsService){
  $scope.allTags = AllTagsService();
  $scope.photos = Instagram.data;
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
  console.log("Last: ",$scope.last);
  $scope.posts = Blog.slice($scope.first, $scope.last);
  console.log($scope.posts);

  $scope.editPost = function(post){
    var titleParsed = HelperService.titleToURL(post.postTitle);
    $location.url('/blog/edit/'+titleParsed);
  }

}])









.controller('EditBlogCtrl', ['$scope', '$state','$stateParams','SendDataService','AllTags','thisPost','HelperService', function($scope, $state, $stateParams, SendDataService, AllTags, thisPost, HelperService){
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



  $scope.updatePost = function(post){
    var year = moment(post.timestamp).format("YYYY");
    var month = moment(post.timestamp).format("MMMM");
    if ($scope.data.mediaSelect === "youtube"){
      $scope.post.youtube = HelperService.parseYouTube($scope.data.youtube);
    } else if ($scope.data.mediaSelect === "image"){

    }
    var newTags = {};
    for (var prop in $scope.checkedTags){
        newTags[prop] = $scope.checkedTags[prop];
    }
    var newTags = {};
    for (var prop in post.tags){
      newTags[prop] = post.tags[prop];
    }
    post.tags = newTags;
    console.log(post);
    var thisPost = {
      postTitle: post.postTitle,
      postBody: post.postBody,
      youtube: post.youtube ? post.youtube : null,
      img: post.img ? post.img : null,
      tags: newTags,
      timestamp: post.timestamp   
    };
    
    $scope.postArray.$save(post).then(function(ref) {
      console.log("success");
      var key = ref.key;
      firebase.database().ref('archives/' + year + '/' + month + '/' + key).remove();
      firebase.database().ref('archives/' + year + '/' + month + '/' + key).set(thisPost);
      for (prop in $scope.originalTags){
        if ($scope.originalTags[prop]){
          firebase.database().ref('tags/' + prop + '/posts/' + key).remove();
          console.log("should be removed");  
        }
      }
      for (prop in post.tags){
        if ($scope.originalTags[prop]){
          // firebase.database().ref('tags/' + prop + '/posts/' + key).set(thisPost);
          // console.log("should be added");
        } 
      }
      $state.go('blog');
    });
  }


}])  


.controller('BlogArchiveCtrl', ['$scope', '$state','$stateParams','Instagram','Blog','Archive','Auth','HelperService','AllTagsService', function($scope, $state, $stateParams, Instagram, Blog, Archive, Auth, HelperService, AllTagsService){
  $scope.allTags = AllTagsService();
  $scope.enable = true;
  $scope.photos = Instagram.data;
  $scope.fullBlog = Blog;
  $scope.allPosts = Archive; 

  
  console.log("archive is: ",$scope.allPosts);

  $scope.parseTitle = HelperService.titleToURL;

//   for (var i = 0; i < archive.length; i++){
//     for (var j = 0; j < $scope.fullBlog.length; j++){
//       if (archive[i].$id === $scope.fullBlog[j].$id){
//         $scope.allPosts.push($scope.fullBlog[j]);
//       }
//     }
//   }
// console.log("allPosts is: ",$scope.allPosts);


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

  $scope.editPost = function(post){
    var titleParsed = HelperService.titleToURL(post.postTitle);
    $location.url('/blog/edit/'+titleParsed);
  }
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

}]) 

.controller('BlogTagsCtrl', ['$scope', '$state','$stateParams','Instagram','Blog','TagsShow','Auth','HelperService','AllTagsService', function($scope, $state, $stateParams, Instagram, Blog, TagsShow, Auth, HelperService, AllTagsService){
  $scope.allTags = AllTagsService();
  $scope.enable = true;
  $scope.photos = Instagram.data;
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

  $scope.editPost = function(post){
    var titleParsed = HelperService.titleToURL(post.postTitle);
    $location.url('/blog/edit/'+titleParsed);
  }
}]) 







.controller('BlogShowCtrl', ['$scope', '$state','$stateParams','thisPost','Instagram','Blog', function($scope, $state, $stateParams,thisPost, Instagram, Blog){

 $scope.enable = false;
 $scope.recentPosts = Blog;
 console.log($scope.recentPosts);
 $scope.photos = Instagram.data; 
 $scope.posts = thisPost;
 $scope.allPosts = thisPost;
}])  





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








.controller('ShowsCtrl', ['$scope', '$state','currentAuth','$uibModal','$log','$firebaseArray','moment','Auth','getShows', function($scope, $state, currentAuth, $uibModal,$log, $firebaseArray, moment, Auth, getShows){

  $scope.shows = getShows;

  $scope.auth = Auth;
  $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
    console.log("firebase user is ",$scope.firebaseUser);
  });


  $scope.open = function(whichPage, index) {
    console.log(whichPage);
    console.log(index);
    var modalInstance = $uibModal.open({
      animation: true,
      backdrop: true,
      templateUrl: '/views/'+whichPage+'ShowModal.html',
      controller: whichPage+'ModalCtrl',
      size: 'lg',
      resolve: {
        editShow: function () {
          return $scope.shows;
        },
        index: index
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }; 

}]) 


.controller('editModalCtrl', function ($scope, $uibModalInstance, editShow, index, $firebaseArray) {
  $scope.shows = editShow;
  $scope.show = editShow[index];

  console.log("index is ",index);
  $scope.dateObj = new Date($scope.show.unix);
  console.log($scope.dateObj);



  $scope.ok = function () {
    $scope.show.date = moment($scope.dateObj).format('ddd, MMMM Do');
    $scope.show.unix = $scope.dateObj.getTime();
    $scope.shows.$save($scope.show).then(function(ref) {
      console.log("success");
    }, function(error) {
      console.log("Error:", error);
    });
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.delete = function(){
    $scope.shows.$remove($scope.show).then(function(ref){
      console.log("successful delete: ",ref);
    }, function(error){
      console.log("error: ",error)
    });
    $uibModalInstance.close();
  }





})


.controller('newModalCtrl', function ($scope, $uibModalInstance, $firebaseArray) {

  $scope.show = {};
  var showsRef = firebase.database().ref('shows');
  $scope.showsArray = $firebaseArray(showsRef);

  $scope.ok = function () {
    var thisDate = moment($scope.show.showDate).format('ddd, MMMM Do');
    var thisUnix = $scope.show.showDate.getTime();
    console.log(thisDate);
    var object = {
      "date": thisDate,
      "unix": thisUnix,
      "location": $scope.show.showLocation,
      "venue": $scope.show.venue,
      "venueLink": $scope.show.venueLink || "",
      "ticketLink": $scope.show.ticketLink || ""
    }
    console.log(object);
    $scope.showsArray.$add(object);
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})
















.controller('LoginCtrl', ['$scope', '$state','Auth', function($scope, $state, Auth){
  $scope.submitted = false;
  $scope.logged = false;


  Auth.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      $scope.logged = true;
      $state.go('home');
      console.log("Signed in as:", firebaseUser.uid);
    } else {
      console.log("Not logged in.");
    }
  });


  // bind form data to user model
  $scope.user = {}


  $scope.login = function() {
    $scope.submitted = true;
    $scope.firebaseUser = null;

    Auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser) {
      console.log("Signed in as:", firebaseUser.uid);
      $scope.firebaseUser = firebaseUser;
    }).catch(function(error) {
      console.error("Authentication failed:", error);
    })
  };


}]) 

.controller('NavCtrl', ['$scope','$timeout','$http','Auth','$state', function($scope, $timeout, $http, Auth, $state){
  $scope.auth = Auth;
  $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;
    console.log("firebase user is ",$scope.firebaseUser);
  });



  $scope.user = {};
  $scope.mailConfirm = false;

  $scope.logout = function(){
    console.log("clicked log out");
    Auth.$signOut();
  };

  $scope.login = function(){
    console.log("clicked log in");
    $state.go('login');  
  }




  $scope.mailchimpSubmit = function(){
    console.log("submit clicked!")
    var url = "//sisterstheband.us14.list-manage.com/subscribe/post-json?u=bc38720b0bcc7a32641bb572c&amp;id=242f4adc89&EMAIL="+$scope.user.email+"&c=JSON_CALLBACK"
    $http.jsonp(url).then(function success(res){
      console.log(res);
      $scope.user = {};
      $scope.mailConfirm = true;
      $timeout(function(){
        $scope.mailConfirm = false;
        console.log("mail confirm reset");
      },7000);
    }, function error(res){
      console.log(res);
    });
  }



  $scope.toggle = true;
  var width = window.innerWidth;
  console.log("inner width: ",width);

  if (width > 806){
    $timeout(function () {
      $scope.fade = true;
    }, 100);
  } else {
    $scope.fade = true;
  }
}])

