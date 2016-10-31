angular.module("SistersServices",["ngResource"]).factory("LoadedService",function(){function e(e){t=e}function r(){return t}var t=!1;return{set:e,get:r}}).factory("Auth",["$firebaseAuth",function(e){return e()}]).factory("ProductsService",["$http","$q",function(e,r){return{allProducts:function(){var t=r.defer();return e.get("/stripe/allProducts").success(function(e){t.resolve(e.data)}),t.promise},oneProduct:function(t){var a=r.defer(),n={method:"GET",url:"/stripe/oneProduct",params:{productId:t}};return e(n).success(function(e){a.resolve(e)}),a.promise}}}]).service("InstagramFactory",["$http","$q",function(e,r){var t=r.defer();return e({method:"GET",url:"/instagram",cache:!0}).success(function(e){t.resolve(e)}).error(function(e){t.reject(e)}),t.promise}]).service("TwitterFactory",["$http","$q",function(e,r){var t=r.defer();return e({method:"GET",url:"/twitter",cache:!0}).success(function(e){t.resolve(e)}).error(function(e){t.reject(e)}),t.promise}]).factory("GetShows",["$firebaseArray","moment",function(e,r){var t=r().unix();return function(){var r=firebase.database().ref("shows").orderByChild("unix").startAt(t);return e(r)}}]).factory("BlogPosts",["$firebaseArray",function(e){return function(){var r=firebase.database().ref("blog_posts").orderByChild("timestamp");return e(r)}}]).factory("ThisPostService",["$firebaseArray",function(e){return function(r){var t=firebase.database().ref("blog_posts"),a=t.orderByChild("slug").equalTo(r);return e(a)}}]).factory("AllTagsService",["$firebaseArray",function(e){return function(){var r=firebase.database().ref("tags");return e(r)}}]).factory("TagsShowService",["$firebaseArray",function(e){return function(r){var t=firebase.database().ref("tags"),a=t.orderByChild("name").equalTo(r);return e(a)}}]).factory("ArchiveService",["$firebaseArray",function(e){return{years:function(){var r=firebase.database().ref("archives");return e(r)},months:function(r){var t=firebase.database().ref("archives/"+r);return e(t)}}}]).factory("ArchiveShowService",["$firebaseArray",function(e){return function(r,t){var a=firebase.database().ref("archives/"+r+"/"+t);return e(a)}}]).factory("SendDataService",function(){function e(e){t=e}function r(){return t}var t={};return{set:e,get:r}}).factory("CurrentOrderService",["$window",function(e){function r(r){e.localStorage.setItem("orderData",angular.toJson(r))}function t(){var r=angular.fromJson(e.localStorage.getItem("orderData"));return JSON.parse(r)}return{set:r,get:t}}]).factory("HelperService",["moment","$q",function(e,r){return{parseYouTube:function(e){var r=e.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);return null!=r?r[1]:void console.log("The youtube url is not valid.")},base64MimeType:function(e){var r=null;if("string"!=typeof e)return r;var t=e.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);return t&&t.length&&(r=t[1]),console.log("image type is ",r),r},getBase64Image:function(e){var r=e.replace(/^data:image\/(png|jpeg);base64,/,"");return r},b64toBlob:function(e,r,t){r=r||"",t=t||512;for(var a=atob(e),n=[],o=0;o<a.length;o+=t){for(var i=a.slice(o,o+t),s=new Array(i.length),c=0;c<i.length;c++)s[c]=i.charCodeAt(c);var u=new Uint8Array(s);n.push(u)}var f=new Blob(n,{type:r});return f},pageDown:function(e){return e<2?"":e-1},findFirst:function(e,r){var t=e-4*(1+r);return t>=0?t:0},titleToURL:function(e){return e.split(" ").join("-")},slugify:function(e){return e.toString().toLowerCase().replace(/\s+/g,"-").replace(/[^\w\-]+/g,"").replace(/\-\-+/g,"-").replace(/^-+/,"").replace(/-+$/,"")},imgResize:function(e){console.log("inside resize!!");var t=r.defer(),a=new Image;return a.src=e,a.onload=function(){console.log(this.width+" "+this.height);var e=a.width/a.height;console.log("WHAT IS RATIO??? ",e);var r=document.createElement("canvas");if(e>=1.776&&a.height>=500){console.log("loadIMG: ",a);var n=(a.height-500)/a.height;r.height=500,r.width=a.width-a.width*n}else if(e<1.776&&a.width>=889){console.log("loadIMG: ",a);var n=(a.width-889)/a.width;r.width=889,r.height=a.height-a.height*n}else console.log("loadIMG: ",a),console.log("image is not big enough!");var o=r.getContext("2d");o.drawImage(a,0,0,r.width,r.height);var i=r.toDataURL("image/jpeg");t.resolve(i)},t.promise}}}]).factory("SubmitImage",["HelperService",function(e){return function(r,t,a,n){e.imgResize(a).then(function(a){var o=e.base64MimeType(a);console.log("TYPE IS ",o);var i=e.getBase64Image(a),s=e.b64toBlob(i,o),c={contentType:o},u=(1e32*Math.random()).toString(36),f=firebase.storage().ref(),l=f.child("blog-images/"+u).put(s,c);l.on(firebase.storage.TaskEvent.STATE_CHANGED,function(e){var r=e.bytesTransferred/e.totalBytes*100;switch(console.log("Upload is "+r+"% done"),e.state){case firebase.storage.TaskState.PAUSED:console.log("Upload is paused");break;case firebase.storage.TaskState.RUNNING:console.log("Upload is running")}},function(e){switch(e.code){case"storage/unauthorized":break;case"storage/canceled":break;case"storage/unknown":}},function(){console.log("upload finished");var e=l.snapshot.downloadURL;n(r,t,e,null)})})}}]);