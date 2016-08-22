angular.module('SistersServices', ['ngResource'])


.factory('LoadedService', function() {
 var loaded = false;
 function set(data) {
   loaded = data;
 }
 function get() {
  return loaded;
 }

 return {
  set: set,
  get: get
 }

})

.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
])

.factory("GetShows", ["$firebaseArray", 
  function($firebaseArray){
    return function(){
    var showsRef = firebase.database().ref('shows').orderByChild("unix");
    console.log("I'm in GetShows");
    return $firebaseArray(showsRef);
  }
}])


.service('InstagramFactory', ['$http', '$q', function ($http, $q) {
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


.factory("BlogPosts", ["$firebaseArray", 
  function($firebaseArray) {
  return function(){
    var blogRef = firebase.database().ref('blog_posts').orderByChild("timestamp");
    return $firebaseArray(blogRef);
  }
}])


.factory("ThisPostService", ["$firebaseArray",
  function($firebaseArray){
    return function(title){
      var postRef = firebase.database().ref('blog_posts');
      var thisPostRef = postRef.orderByChild('postTitle').equalTo(title);
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


.factory("ArchiveService", ["$firebaseArray", 
  function($firebaseArray){
    return {
      years: function(){
      var yearRef = firebase.database().ref('archives');
      return $firebaseArray(yearRef)
      },
      months: function(year){
      var monthRef = firebase.database().ref('archives/'+year);
      return $firebaseArray(monthRef)
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

.factory('SendDataService', function() {
 var savedData = {}
 function set(data) {
   savedData = data;
 }
 function get() {
  return savedData;
 }

 return {
  set: set,
  get: get
 }

})

.factory('HelperService', ["moment", function(moment) {
  return {
    parseYouTube: function(url){
      var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        if(videoid != null) {
          return videoid[1];
        } else { 
          console.log("The youtube url is not valid.");
        }
    },
    base64MimeType: function(encoded){
      var result = null;
      if (typeof encoded !== 'string') {
        return result;
      }
      var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
      if (mime && mime.length) {
        result = mime[1];
      }
      return result;
    },
    getBase64Image: function(dataURL) {
      var base64 = dataURL.replace(/^data:image\/(png|jpeg);base64,/, "");
      return base64;
    },
    b64toBlob: function(b64Data, contentType, sliceSize) {
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
    },
    pageDown: function(currentPage){
      if (currentPage < 2){
        return "";
      } else {
        return currentPage - (1);
      }
    },
    findFirst: function(length, page){
    var calcFirst = length - (4*(1+page));
      if (calcFirst >= 0){
        return calcFirst
      } else {
        return 0;
      }
    },
    titleToURL: function(title){
    return title.split(' ').join('-');
    }
  };
}])


.factory('SubmitImage', ["HelperService", function(HelperService) {
  return function(post, postArray, image, callback){
    var mime = HelperService.base64MimeType(image);
    var base64result = HelperService.getBase64Image(image)
    var file = HelperService.b64toBlob(base64result, mime)
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
    var downloadURL = uploadTask.snapshot.downloadURL;
    callback(post, postArray, downloadURL, null);
  });
  }

}])







