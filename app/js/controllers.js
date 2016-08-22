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


.controller('BlogCtrl', ['$scope', '$state','$http','$location','$stateParams','Instagram','Auth','Blog','HelperService','ArchiveService','AllTagsService', function($scope, $state, $http, $location, $stateParams, Instagram, Auth, Blog, HelperService, ArchiveService, AllTagsService){
  $scope.findFirst = function(length, page){
    var calcFirst = length - (4*(1+page));
    if (calcFirst >= 0){
      return calcFirst
    } else {
      return 0;
    }
  }

  $scope.years = ArchiveService.years();
  $scope.years.$loaded().then(function(){
    console.log("YEARS!!!", $scope.years); 
  })

  $scope.allTags = AllTagsService();



  $scope.auth = Auth;
  $scope.auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.firebaseUser = firebaseUser;

  });
  $scope.allPosts = Blog;
  console.log(Blog);
  $scope.page = $stateParams.page || 0;
  $scope.pageUp = parseInt($scope.page) + (1);
  $scope.pageDown = HelperService.pageDown($scope.page);
  $scope.length = Blog.length;
  console.log("Length: ",$scope.length);
  $scope.first = $scope.findFirst($scope.length, $scope.page);

  console.log("First: ",$scope.first);
  $scope.last = $scope.length - (4 * $scope.page);
  console.log("Last: ",$scope.last);
  $scope.posts = Blog.slice($scope.first, $scope.last);
  console.log($scope.posts);
  $scope.photos = Instagram.data;

  $scope.newBlogPost = function(){
    $state.go("blog-new");
  }

  $scope.editPost = function(post){
    var titleParsed = post.postTitle.split(' ').join('-');
    $location.url('/blog/edit/'+titleParsed);
  }

  $scope.parseTitle = function(title){
    return title.split(' ').join('-');
  }



}])









.controller('EditBlogCtrl', ['$scope', '$state','$stateParams','SendDataService','AllTags','thisPost','HelperService', function($scope, $state, $stateParams, SendDataService, AllTags, thisPost, HelperService){
  $scope.data = {};
  $scope.changeImage = false;
  
  $scope.postArray = thisPost;
  $scope.post = thisPost[0];
  console.log($scope.post);

  $scope.tags = AllTags;
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
    if ($scope.data.mediaSelect === "youtube"){
      $scope.post.youtube = HelperService.parseYouTube($scope.data.youtube);
    } else if ($scope.data.mediaSelect === "image"){

    }
    $scope.postArray.$save(post).then(function(ref) {
      console.log("success");
      $state.go('blog');
    });
  }


}])  



.controller('BlogShowCtrl', ['$scope', '$state','$stateParams','thisPost','Instagram','Blog', function($scope, $state, $stateParams,thisPost, Instagram, Blog){
 $scope.photos = Instagram.data; 
 $scope.post = thisPost[0];
 console.log($scope.post)
 $scope.allPosts = Blog;
}])  


.controller('NewBlogCtrl', ['$scope', '$state','$http','Auth','BlogPosts','AllTags','HelperService','SubmitImage','moment', function($scope, $state, $http, Auth, BlogPosts, AllTags, HelperService, SubmitImage, moment){
  $scope.BlogPosts = BlogPosts();
  $scope.tags = AllTags;

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
    for (var i = 0; i < post.tags.length; i++){
      newTags[post.tags[i].$id] = {
        "name": post.tags[i].name,
        "posts": null 
      }
    }
    var thisPost = {
      postTitle: post.title,
      postBody: post.body,
      youtube: youtube ? youtube : null,
      img: img ? img : null,
      tags: newTags,
      timestamp: postDate   
    };
    postArray.$add(thisPost).then(function(ref){
      var key = ref.key;
      firebase.database().ref('archives/' + year + '/' + month + '/' + key).set(thisPost);
      for (prop in newTags){
      firebase.database().ref('tags/' + prop + '/posts/' + key).set(thisPost); 
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
    console.log()
    console.log(index);
    var modalInstance = $uibModal.open({
      animation: true,
      backdrop: true,
      templateUrl: 'app/views/'+whichPage+'ShowModal.html',
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

