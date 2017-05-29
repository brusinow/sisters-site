angular.module('SistersServices', ['ngResource'])


  .factory('LoadedService', function () {
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
    function ($firebaseAuth) {
      return $firebaseAuth();
    }
  ])



  .factory('SendDataService', function () {
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



  .factory('FirebaseImgDownloader', ['$q', function ($q) {
    return function (product) {
      console.log("product in imgdownloader: ", product);
      var images = product.images;
      var promises = images.map(function (obj, i) {
        var deferred = $q.defer();
        var url = obj.downloadURL;
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function (event) {
          var blob = xhr.response;
          console.log("Blob!!!!", blob);
          blob.name = obj.name;
          deferred.resolve(blob);
        };
        xhr.open('GET', url);
        xhr.send();
        return deferred.promise;
      })

      return $q.all(promises);
    }
  }])

  // NEED TO MAKE ANOTHER DOWNLOADER FOR BLOG


  .factory('UpdateAllCounts', ['$q', function ($q) {
    return function (prods) {
      var defer = $q.defer();
      var promises = [];
      for (var i = 0; i < prods.length; i++) {
        if (!prods[i].variant.bool) {
          // check add and remove

          var firstSku = prods[i].variant.skus[Object.keys(prods[i].variant.skus)[0]];
          console.log("first sku? ", firstSku);
          var count = firstSku.count;
          if (prods[i].add && prods[i].add > 0) {
            count = parseInt(count) + prods[i].add;
            firstSku.count = count;
            delete prods[i].add;
          }
          if (prods[i].remove && prods[i].remove > 0) {
            count = parseInt(count) - prods[i].remove;
            firstSku.count = count;
            delete prods[i].remove;
          }
          promises.push("test");
        } else {
          angular.forEach(prods[i].variant.skus, function (value, key) {
            var count = value.count;
            if (value.add && value.add > 0) {
              value.count = parseInt(value.count) + value.add;
              delete value.add;
            }
            if (value.remove && value.remove > 0) {
              value.count = parseInt(value.count) - value.remove;
              delete value.remove;
            }
            promises.push("test");
          });
        }
        prods.$save(i).then(function (ref) {
          console.log("saved");
        });
      }
      $q.all(promises).then(function () {
        defer.resolve();
      });
      return defer.promise;
    }
  }])






  .factory('HelperService', ["moment", "$q", function (moment, $q) {
    return {
      idGenerator: function (num, type) {
        var newNumString = (num).toString();
        while (newNumString.length < 4) {
          newNumString = "0" + newNumString;
        }
        newNumString = type + newNumString;
        return newNumString;
      },
      parseYouTube: function (url) {
        var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        if (videoid != null) {
          return videoid[1];
        } else {
          console.log("The youtube url is not valid.");
        }
      },
      base64MimeType: function (encoded) {
        var result = null;
        if (typeof encoded !== 'string') {
          return result;
        }
        var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
        if (mime && mime.length) {
          result = mime[1];
        }
        console.log("image type is ", result);
        return result;
      },
      getBase64Image: function (dataURL) {
        var base64 = dataURL.replace(/^data:image\/(png|jpeg);base64,/, "");
        return base64;
      },
      b64toBlob: function (b64Data, contentType) {
        contentType = contentType || '';
        var sliceSize = 512;
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
        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
      },
      pageDown: function (currentPage) {
        if (currentPage < 2) {
          return "";
        } else {
          return currentPage - (1);
        }
      },
      findFirst: function (length, page) {
        var calcFirst = length - (4 * (1 + page));
        if (calcFirst >= 0) {
          return calcFirst
        } else {
          return 0;
        }
      },
      getToday: function () {
        var currentDay = moment().unix();
        return currentDay;
      },
      titleToURL: function (title) {

        return title.split(' ').join('-');
      },
      slugify: function (text, unix) {
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

  .factory("ProdSkuFactory", ["$q", "HelperService", function ($q, HelperService) {
    return {
      get: function (type) {
        var deferred = $q.defer();
        var idRef;
        var slicePoint;
        if (type === "sku") {
          idRef = firebase.database().ref('saved_values/lastSku');
          slicePoint = 3;
        } else if (type === "prod") {
          idRef = firebase.database().ref('saved_values/lastProduct');
          slicePoint = 4;
        }
        idRef.once('value').then(function (snapshot) {
          var id = snapshot.val()
          var num = parseInt(id.slice(slicePoint))
          deferred.resolve(num);
        });
        return deferred.promise;
      },
      set: function (num, type) {
        var idRef
        if (type === "sku") {
          idRef = firebase.database().ref('saved_values/lastSku');
          slicePoint = 3;
        } else if (type === "prod") {
          idRef = firebase.database().ref('saved_values/lastProduct');
          slicePoint = 4;
        }
        var id = HelperService.idGenerator(num + 1, type);
        idRef.set(id);
      }
    }
  }])

  .factory('ImgCompressFactory', ["$q", function ($q) {
    return function (source_img_obj, quality, width, height, output_format) {
      var mime_type = "image/jpeg";
      if (typeof output_format !== "undefined" && output_format == "png") {
        mime_type = "image/png";
      }
      var cvs = document.createElement('canvas');
      cvs.width = width;
      cvs.height = height;
      var ctx = cvs.getContext("2d")
      ctx.drawImage(source_img_obj, 0, 0, width, height);
      var newImageData = cvs.toDataURL(mime_type, quality / 100);
      return newImageData;
    }
  }])

  .factory('ImageResizeFactory', ["HelperService", 'ImgCompressFactory', "$q", function (HelperService, ImgCompressFactory, $q) {
    return {
      imgResizeSquare: function (img) {
        var deferred = $q.defer();
        var loadIMG = new Image;
        loadIMG.src = window.URL.createObjectURL(img);;
        loadIMG.onload = function () {
          var aspectRatio = loadIMG.width / loadIMG.height;
          console.log("WHAT IS RATIO??? ", aspectRatio);

          if (loadIMG.height < 1000 || loadIMG.width < 1000) {
            deferred.reject("Not all images are at least 1000px x 1000px. Please double check and try again.");
          } else if (aspectRatio !== 1) {
            deferred.reject("Please upload only square images.");
          } else {
            var resizedResult = ImgCompressFactory(loadIMG, 50, 1000, 1000)
            var base64result = HelperService.getBase64Image(resizedResult);
            var file = HelperService.b64toBlob(base64result, "image/jpeg");
            deferred.resolve(file);
          }
        }
        console.log("right before return for resize: ", deferred.promise);
        return deferred.promise;
      },
      imgResizeBlog: function (img) {
        console.log("what is img? ", img);
        var deferred = $q.defer();
        var height;
        var width;
        var loadIMG = new Image;
        loadIMG.src = window.URL.createObjectURL(img);;
        loadIMG.onload = function () {
          console.log(this.width + " " + this.height);
          var aspectRatio = loadIMG.width / loadIMG.height;
          console.log("WHAT IS RATIO??? ", aspectRatio);
          if (aspectRatio >= 1.776 && loadIMG.height >= 500) {
            console.log("loadIMG: ", loadIMG);
            var percentChange = (loadIMG.height - 500) / loadIMG.height;
            height = 500;
            width = loadIMG.width - (loadIMG.width * percentChange);
          } else if (aspectRatio < 1.776 && loadIMG.width >= 889) {
            var percentChange = (loadIMG.width - 889) / loadIMG.width;
            width = 889;
            height = loadIMG.height - (loadIMG.height * percentChange);
          } else {
            deferred.reject("This image does not have a high enough resolution (Minimum size: 889px x 500px)");
          }
          var resizedResult = ImgCompressFactory(loadIMG, 50, width, height)
          var base64result = HelperService.getBase64Image(resizedResult);
          var file = HelperService.b64toBlob(base64result, "image/jpeg");
          deferred.resolve(file);

        }
        return deferred.promise;
      }
    }
  }])

  .factory('CheckImgExists', ['$q', '$firebaseStorage', function ($q, $firebaseStorage) {
    return function (path, name) {
      var deferred = $q.defer();
      var storageRef = firebase.storage().ref();
      storageRef.child(path + name).getDownloadURL().then(onResolve, onReject);

      function onResolve(foundURL) {
        deferred.resolve(foundURL)
      }
      function onReject(error) {
        deferred.resolve(false)
      }
      return deferred.promise;
    }
  }])

  .factory('UploadImages', ["ImageResizeFactory", "CheckImgExists", '$q', '$firebaseStorage', function (ImageResizeFactory, CheckImgExists, $q, $firebaseStorage) {
    return function (imageObject, type, identifier) {
      var urlPath;
      var uploadTask;
      if (type === "store") {
        urlPath = 'store-images/' + identifier + '/';
      } else if (type === "blog") {
        urlPath = 'blog-images/';
      }
      var promises = imageObject.map(function (obj, i) {
        var deferred = $q.defer();
        var resizeMethod = type === "blog" ? ImageResizeFactory.imgResizeBlog : ImageResizeFactory.imgResizeSquare;
        console.log("OBJ: ", obj);
        CheckImgExists(urlPath, obj.name).then(function (checkResult) {
          if (checkResult !== false) {
            console.log("found image!!!!!");
            if (type === "blog") {
              deferred.resolve(checkResult);
            } else if (type === "store") {
              deferred.resolve({
                "downloadURL": checkResult,
                "name": obj.name
              });
            }
          } else {
            resizeMethod(obj.file).then(function (newImg) {
              console.log("resizing new image!!!");
              var photoHash = Math.random().toString(36).substring(7)
              var fullPath = urlPath + photoHash + ".jpg";
              var storageRef = firebase.storage().ref(fullPath);
              var fbStorage = $firebaseStorage(storageRef);
              uploadTask = fbStorage.$put(newImg);
              uploadTask.$complete(function (snapshot) {
                var downloadURL = snapshot.downloadURL;
                if (type === "blog") {
                  deferred.resolve(downloadURL)
                } else if (type === "store") {
                  deferred.resolve({
                    "downloadURL": downloadURL,
                    "name": snapshot.metadata.name
                  })
                }
              });
            }, function (reason) {
              alert(reason);
            })
          }
        })


        return deferred.promise;
      })

      return $q.all(promises);
    }
  }])


