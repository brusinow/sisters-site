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


.factory("ProductsService", ["$http","$q", function($http, $q){
  return {
    allProducts: function(){
      var deferred = $q.defer();
      // console.log("inside all products service")
      $http.get('/stripe/allProducts').success(function(data){
        // products = data.data;
        deferred.resolve(data.data);
        // console.log("products in service: ",products);   
      }); 
      return deferred.promise;   
    },
    oneProduct: function(productId){
      // console.log("what's id? ",productId);
      var deferred = $q.defer();
      var req = {
        method: 'GET',
        url: '/stripe/oneProduct',
        params: {
          productId: productId
        }
      }
      $http(req).success(function(data){
        // console.log("success!!!")
        deferred.resolve(data);
      })
      return deferred.promise;
    }
  }
}])

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




.factory("GetShows", ["$firebaseArray","moment", 
  function($firebaseArray, moment){
    var currentDay = moment().unix();
    // console.log("current day: ",currentDay);
    return function(){
    var showsRef = firebase.database().ref('shows').orderByChild("unix").startAt(currentDay);
    // console.log("I'm in GetShows");
    return $firebaseArray(showsRef);
  }
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

.factory('CurrentOrderService', function($window) {
 function set(data) {
   $window.localStorage.setItem( 'orderData', angular.toJson(data) );
  //  console.log("order saved!");
 }
 function get() {
  var order = angular.fromJson( $window.localStorage.getItem('orderData') ) ;
    return JSON.parse(order);
 }

 return {
  set: set,
  get: get
 }
})




.factory('HelperService', ["moment","$q", function(moment, $q) {
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
      console.log("image type is ",result);
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
    },
    slugify: function(text){
      return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
    },
    imgResize: function (img) {
      var isResized;
      console.log("inside resize!!");
    var deferred = $q.defer();
    var loadIMG = new Image;
    loadIMG.src = img;
    console.log("what is loadIMG? ",loadIMG);
    console.log("loadIMG height is "+loadIMG.height+", width is "+loadIMG.width);
    var aspectRatio = loadIMG.width / loadIMG.height;
    var canvas = document.createElement('canvas');
    
    if (aspectRatio >= 1.776 && loadIMG.height >= 500){
      var percentChange = (loadIMG.height - 500) / loadIMG.height;
      canvas.height = 500;
      canvas.width = loadIMG.width - (loadIMG.width * percentChange);
      isResized = true;
    } else if (aspectRatio < 1.776 && loadIMG.width >= 889){
      var percentChange = (loadIMG.width - 889) / loadIMG.width;
      canvas.width = 889;
      canvas.height = loadIMG.height - (loadIMG.height * percentChange);
      isResized = true;
    } else {
      console.log("image is not big enough!");
      isResized = false;
    }
    if (isResized){
    var ctx = canvas.getContext("2d");
    ctx.drawImage(loadIMG, 0, 0, canvas.width, canvas.height);
    var resizedResult = canvas.toDataURL("image/jpeg");
    deferred.resolve(resizedResult);
    } else {
      deferred.resolve(img);
    }    
    return deferred.promise; 
    }
  } 
}])




.factory('SubmitImage', ["HelperService", function(HelperService) {
  return function(post, postArray, image, callback){
    HelperService.imgResize(image).then(function(newImage){
      var mime = HelperService.base64MimeType(newImage);
    console.log("TYPE IS ",mime);
    var base64result = HelperService.getBase64Image(newImage)
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
    })
    



  }

}])







