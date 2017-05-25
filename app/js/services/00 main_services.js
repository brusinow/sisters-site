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



.factory('FirebaseImgDownloader', ['$q', function($q){
  return function(product){
      var images = product.images;
      var promises = images.map(function(obj, i){
        var deferred = $q.defer();  
          var url = obj;
          var xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = function(event) {
            var blob = xhr.response;
            console.log("Blob!!!!", blob);
            blob.name = product.id + "_" + i + ".jpg";
            deferred.resolve(blob);
          };
          xhr.open('GET', url);
          xhr.send();     
        return deferred.promise; 
      })
              
    return $q.all(promises);
  }
}])


.factory('UpdateAllCounts', ['$q', function($q){
  return function(prods){
    var defer = $q.defer();
    var promises = [];
    for (var i = 0; i < prods.length; i++){
      if (!prods[i].variant.bool){
        // check add and remove
      
        var firstSku = prods[i].variant.skus[Object.keys(prods[i].variant.skus)[0]];
        console.log("first sku? ",firstSku);
        var count = firstSku.count;
        if (prods[i].add && prods[i].add > 0){
          count = parseInt(count) + prods[i].add;
          firstSku.count = count;
          delete prods[i].add;
        }
        if (prods[i].remove && prods[i].remove > 0){
          count = parseInt(count) - prods[i].remove;
          firstSku.count = count;
          delete prods[i].remove;
        }
        promises.push("test");
      } else {
        angular.forEach(prods[i].variant.skus, function(value, key) {
          var count = value.count;
          if (value.add && value.add > 0){
            value.count = parseInt(value.count) + value.add;
            delete value.add;
          }
          if (value.remove && value.remove > 0){
            value.count = parseInt(value.count) - value.remove;
            delete value.remove;
          }
           promises.push("test");
        });
      }
      prods.$save(i).then(function(ref) {
          console.log("saved");
      });
    }
    $q.all(promises).then(function(){
      defer.resolve();
    });
    return defer.promise;
  }
}])






.factory('HelperService', ["moment","$q", function(moment, $q) {
  return {
    idGenerator: function(num, type){
      var newNumString = (num).toString();
      while (newNumString.length < 4){
        newNumString = "0" + newNumString;
      }
      newNumString = type + newNumString;
      return newNumString;
    },
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
    }
  } 
}])

.factory("ProdSkuFactory", ["$q", "HelperService", function($q, HelperService){
  return {
    get: function(type){
      var deferred = $q.defer();
      var idRef;
      var slicePoint;
      if (type === "sku"){
        idRef = firebase.database().ref('saved_values/lastSku');
        slicePoint = 3;
      } else if (type === "prod"){
        idRef = firebase.database().ref('saved_values/lastProduct');
        slicePoint = 4;
      }
      idRef.once('value').then(function(snapshot) {
        var id = snapshot.val()
        var num = parseInt(id.slice(slicePoint))     
        deferred.resolve(num);     
      });
      return deferred.promise;
    },
    set: function(num, type){
      var idRef
      if (type === "sku"){
        idRef = firebase.database().ref('saved_values/lastSku');
        slicePoint = 3;
      } else if (type === "prod"){
        idRef = firebase.database().ref('saved_values/lastProduct');
        slicePoint = 4;
      }
      var id = HelperService.idGenerator(num + 1, type);
      idRef.set(id);
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
      var promises = imageObject.map(function(obj, i){
        var deferred = $q.defer();  
          ImageResizeFactory.imgResizeSquare(obj.file).then(function(newImg){
            var photoId = identifier + "_" + i + ".jpg";
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

