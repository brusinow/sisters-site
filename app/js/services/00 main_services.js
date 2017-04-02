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

// .factory("DownloadKeyService", function(){
//     return function(hash){
//       console.log("hash is "+hash);
//       // firebase.database().ref('downloadKeys/' + hash).set("test value");
//       firebase.database().ref('downloadKeys/'+hash).once('value').then(function(snapshot) {
//         var snap = snapshot.val();
//         console.log(snap);
//       });
//     }
//   }
// )


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

.factory("StoreCurrent", ["$q", function($q){
  return {
    product: function(){
    var deferred = $q.defer();
    var productIdRef = firebase.database().ref('saved_values/lastProduct');
    productIdRef.once('value').then(function(snapshot) {
      var id = snapshot.val();
      var num = parseInt(id.slice(4));
      var newNumString = (num + 1).toString();
      while (newNumString.length < 4){
        newNumString = "0" + newNumString;
      }
      newNumString = "prod" + newNumString;
      productIdRef.set(newNumString);
      console.log("new num string: ",newNumString);
      deferred.resolve(newNumString);     
    });
    return deferred.promise;
    },
    sku: function(){
    var deferred = $q.defer();
    var skuRef = firebase.database().ref('saved_values/lastSku');
    skuRef.once('value').then(function(snapshot) {
      var id = snapshot.val();
      var num = parseInt(id.slice(3));
      var newNumString = (num + 1).toString();
      while (newNumString.length < 4){
        newNumString = "0" + newNumString;
      }
      newNumString = "sku" + newNumString;
      skuRef.set(newNumString);
      deferred.resolve(newNumString);    
    });
    return deferred.promise;
    }
  }
}])


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
    getToday: function(){
      var currentDay = moment().unix();
      return currentDay;
    },
    titleToURL: function(title){
      
    return title.split(' ').join('-');
    },
    slugify: function(text, unix){
      var text = text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
      var date = moment(unix).tz("America/Los_Angeles").format('MM-DD-YY');
      var complete = date + "_" + text;
      return complete;
    },
    imgResizeBlog: function (img) {
      console.log("inside resize!!");
    var deferred = $q.defer();
    var loadIMG = new Image;
    loadIMG.src = img;
    loadIMG.onload = function(){
       console.log(this.width + " " + this.height);
       var aspectRatio = loadIMG.width / loadIMG.height;
       console.log("WHAT IS RATIO??? ",aspectRatio);
       var canvas = document.createElement('canvas');
        if (aspectRatio >= 1.776 && loadIMG.height >= 500){
          console.log("loadIMG: ",loadIMG);
          var percentChange = (loadIMG.height - 500) / loadIMG.height;
          canvas.height = 500;
          canvas.width = loadIMG.width - (loadIMG.width * percentChange);
        
        } else if (aspectRatio < 1.776 && loadIMG.width >= 889){
          console.log("loadIMG: ",loadIMG);
          var percentChange = (loadIMG.width - 889) / loadIMG.width;
          canvas.width = 889;
          canvas.height = loadIMG.height - (loadIMG.height * percentChange);
          
        } else {
          console.log("loadIMG: ",loadIMG);
          console.log("image is not big enough!");  
        }
        var ctx = canvas.getContext("2d");
        ctx.drawImage(loadIMG, 0, 0, canvas.width, canvas.height);
        var resizedResult = canvas.toDataURL("image/jpeg");
        deferred.resolve(resizedResult);   
    }
    return deferred.promise; 
  }
  } 
}])

.factory('ImageResizeFactory', ["HelperService", "$q", function(HelperService, $q){
  return {
      imgResizeSquare: function (img) {
      console.log("what is img? ",img);
      var deferred = $q.defer();
      var loadIMG = new Image;
      loadIMG.src = window.URL.createObjectURL(img);;
        loadIMG.onload = function(){
        console.log(this.width + " " + this.height);
        var aspectRatio = loadIMG.width / loadIMG.height;
        console.log("WHAT IS RATIO??? ",aspectRatio);
        
          if (loadIMG.height < 1000 || loadIMG.width < 1000){
            deferred.reject("Not all images are at least 1000px x 1000px. Please double check and try again."); 
          } else if (aspectRatio !== 1){
            deferred.reject("Please upload only square images."); 
          } else {
            var canvas = document.createElement('canvas');
            canvas.height = 1000;
            canvas.width = 1000;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(loadIMG, 0, 0, canvas.width, canvas.height);
            var resizedResult = canvas.toDataURL("image/jpeg");
            var base64result = HelperService.getBase64Image(resizedResult);
            var file = HelperService.b64toBlob(base64result, "image/jpeg");
            deferred.resolve(file);  
          }
        }      
        console.log("right before return for resize: ",deferred.promise);
        return deferred.promise; 
      },
      imgResizeBlog: function (img) {
      console.log("what is img? ",img);
      var deferred = $q.defer();
      var loadIMG = new Image;
      loadIMG.src = window.URL.createObjectURL(img);;
        loadIMG.onload = function(){
        console.log(this.width + " " + this.height);
        var aspectRatio = loadIMG.width / loadIMG.height;
        console.log("WHAT IS RATIO??? ",aspectRatio);
        var canvas = document.createElement('canvas');
        if (aspectRatio >= 1.776 && loadIMG.height >= 500){
          console.log("loadIMG: ",loadIMG);
          var percentChange = (loadIMG.height - 500) / loadIMG.height;
          canvas.height = 500;
          canvas.width = loadIMG.width - (loadIMG.width * percentChange);
        
        } else if (aspectRatio < 1.776 && loadIMG.width >= 889){
          console.log("loadIMG: ",loadIMG);
          var percentChange = (loadIMG.width - 889) / loadIMG.width;
          canvas.width = 889;
          canvas.height = loadIMG.height - (loadIMG.height * percentChange);
          
        } else {
          deferred.reject("This image does not have a high enough resolution (Minimum size: 889px x 500px)");
        }
          var ctx = canvas.getContext("2d");
          ctx.drawImage(loadIMG, 0, 0, canvas.width, canvas.height);
          var resizedResult = canvas.toDataURL("image/jpeg");
          var base64result = HelperService.getBase64Image(resizedResult);
          var file = HelperService.b64toBlob(base64result, "image/jpeg");
          deferred.resolve(file);  
          
        }      
        return deferred.promise; 
      }
  }
}])

.factory('UploadImages', ["ImageResizeFactory", '$q','$firebaseStorage', function(ImageResizeFactory, $q, $firebaseStorage){
  return function(imageObject, type, identifier){
    var urlPath;
    var uploadTask;
      if (type === "store"){
        urlPath = 'store-images/' + identifier + '/';
      } else if (type === "blog"){
        urlPath = 'blog-images/';
      }     
      var promises = imageObject.map(function(obj){
        var deferred = $q.defer();  
          ImageResizeFactory.imgResizeSquare(obj.file).then(function(newImg){
            var photoId = obj.file.name;
            var fullPath = urlPath + photoId;
            var storageRef = firebase.storage().ref(fullPath);
            var fbStorage = $firebaseStorage(storageRef);
            uploadTask = fbStorage.$put(newImg);
            uploadTask.$complete(function(snapshot) {
              var downloadURL = snapshot.downloadURL;
              deferred.resolve(downloadURL);
            }); 
          }, function(reason){
            alert(reason);
          })  
 
        return deferred.promise; 
      })
              
    return $q.all(promises);
  }
}])






// .factory('SubmitBlogImage', ["HelperService", function(HelperService) {
//   return function(post, postArray, image, callback){
//     HelperService.imgResizeBlog(image).then(function(newImage){
//     var mime = HelperService.base64MimeType(newImage);
//     var base64result = HelperService.getBase64Image(newImage)
//     var file = HelperService.b64toBlob(base64result, mime)
//     var metadata = {
//     contentType: mime
//     };
//     var photoId = (Math.random()*1e32).toString(36);
//     var storageRef = firebase.storage().ref();
//     var uploadTask = storageRef.child('blog-images/' + photoId).put(file, metadata);
//     uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
//     function(snapshot) {
//       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//       var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       console.log('Upload is ' + progress + '% done');
//       switch (snapshot.state) {
//         case firebase.storage.TaskState.PAUSED: // or 'paused'
//           console.log('Upload is paused');
//           break;
//         case firebase.storage.TaskState.RUNNING: // or 'running'
//           console.log('Upload is running');
//           break;
//       }
//     }, function(error) {
//     switch (error.code) {
//       case 'storage/unauthorized':
//         break;
//       case 'storage/canceled':
//         // User canceled the upload
//         break;
//       case 'storage/unknown':
//         // Unknown error occurred, inspect error.serverResponse
//         break;
//     }
//   }, function() {
//     console.log("upload finished")
//     var downloadURL = uploadTask.snapshot.downloadURL;
//     callback(post, postArray, downloadURL, null);
//   });
//     })
    
//   }

// }])







