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

.controller('AboutCtrl', ['$scope', '$state', function($scope, $state){
    
}]) 



.controller('BlogCtrl', ['$scope', '$state','$http','Instagram','Auth','BlogPosts', function($scope, $state, $http, Instagram, Auth, BlogPosts){
  $scope.auth = Auth;
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;
      console.log("firebase user is ",$scope.firebaseUser);
  });

$scope.posts = BlogPosts();
console.log($scope.posts)  
$scope.photos = Instagram.data;

$scope.newBlogPost = function(){
  $state.go("blog-new");
}

}]) 


.controller('NewBlogCtrl', ['$scope', '$state','$http','Auth','BlogPosts', function($scope, $state, $http, Auth, BlogPosts){
$scope.BlogPosts = BlogPosts();


$scope.resetMedia = function(){
  $scope.data.youtube = "";
  $scope.data.image = "";
}

$scope.submit = function(){
  if ($scope.data.mediaSelect === 'image'){
    submitImage();
  } else if ($scope.data.mediaSelect === 'youtube'){
    $scope.data.youtube = parseYouTube($scope.data.youtube);
    addPost();
  }
}


var parseYouTube = function(url){
  var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
  if(videoid != null) {
    return videoid[1];
  } else { 
    console.log("The youtube url is not valid.");
  }
}

var submitImage = function(){
    console.log("Submit image clicked!");
    var mime = base64MimeType($scope.data.image);
    var base64result = getBase64Image($scope.data.image)
    var file = b64toBlob(base64result, mime)
    var metadata = {
    contentType: mime
    };
    var photoId = (Math.random()*1e32).toString(36);
    var storageRef = firebase.storage().ref();
    var uploadTask = storageRef.child('blog-images/' + photoId).put(file, metadata);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function(snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) {
    switch (error.code) {
      case 'storage/unauthorized':
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;
      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  }, function() {
    console.log("upload finished")
    $scope.data.downloadURL = uploadTask.snapshot.downloadURL;
    addPost();
  });
}

var addPost = function(){
      $scope.BlogPosts.$add({
        postTitle: $scope.post.title,
        postBody: $scope.post.body,
        youtube: $scope.data.youtube ? $scope.data.youtube : null,
        img: $scope.data.downloadURL ? $scope.data.downloadURL : null,
        timestamp: new Date().getTime()     
      }).then(function(ref){
        $scope.postId = ref.key;
        console.log("what is post id? ",ref.key);
      });
}

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;
  var byteCharacters = atob(b64Data);
  var byteArrays = [];
  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);
    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  } 
  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

function base64MimeType(encoded) {
  var result = null;
  if (typeof encoded !== 'string') {
    return result;
  }
  var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  if (mime && mime.length) {
    result = mime[1];
  }
  return result;
}


function getBase64Image(dataURL) {
  var base64 = dataURL.replace(/^data:image\/(png|jpeg);base64,/, "");
  return base64;
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

