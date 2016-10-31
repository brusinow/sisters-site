angular.module("SistersCtrls").controller("NewBlogCtrl",["$scope","$state","$http","Auth","BlogPosts","AllTags","HelperService","SubmitImage","moment",function(e,t,a,o,s,n,i,l,r){var g=document.getElementById("main");g.style.backgroundColor="rgba(0,0,0,0)",e.$emit("loadMainContainer","loaded"),e.BlogPosts=s(),e.tags=n,e.checkedTags={},e.data={},e.resetMedia=function(){e.data.youtube="",e.data.image=""},e.submit=function(){console.log("submit clicked"),console.log("what is post? ",e.post),"image"===e.data.mediaSelect?l(e.post,e.BlogPosts,e.data.image,d):"youtube"===e.data.mediaSelect&&(e.data.youtube=i.parseYouTube(e.data.youtube),d(e.post,e.BlogPosts,null,e.data.youtube))},e.addTag=function(){e.tags.$add({name:e.data.newTag}).then(function(t){e.postId=t.key,console.log("what is post id? ",t.key),e.data.newTag=""})},e.resizeImg=function(e){i.imgResize(e)},e.deleteTag=function(t){e.tags.$remove(t).then(function(e){e.key===t.$id})};var d=function(a,o,s,n){var l=i.slugify(a.title),g=(new Date).getTime(),d=r(g).format("YYYY"),u=r(g).format("MMMM"),m={};for(var c in e.checkedTags)m[c]=e.checkedTags[c];var f={postTitle:a.title,slug:l,postBody:a.postBody,youtube:n?n:null,img:s?s:null,tags:m,timestamp:g};console.log("thisPost: ",f),o.$add(f).then(function(e){var a=e.key,o={key:a};firebase.database().ref("archives/"+d+"/"+u+"/"+a).set(o),t.go("blog.main")})}}]).controller("EditBlogCtrl",["$scope","$state","$timeout","$stateParams","SendDataService","AllTags","thisPost","HelperService","SubmitImage","$uibModal","$log","BlogPosts",function(e,t,a,o,s,n,i,l,r,g,d,u){var m=document.getElementById("main");if(m.style.backgroundColor="rgba(0,0,0,0)",e.$emit("loadMainContainer","loaded"),e.data={},e.postArray=i,e.post=i[0],e.originalTags=angular.copy(e.post.tags),e.tags=n,e.post.youtube){console.log(e.post.youtube);var c=e.post.youtube;e.data.youtube="https://www.youtube.com/watch?v="+c}e.confirmBlogDelete=function(e){var t=g.open({animation:!0,backdrop:!0,templateUrl:"/views/blog/deleteBlogConfirmModal.html",controller:"DeleteBlogConfirmCtrl",size:"sm",resolve:{Post:e}});t.result.then(function(){console.log("submitted modal")},function(){d.info("Modal dismissed at: "+new Date)})},e.addTag=function(){e.tags.$add({name:e.data.newTag}).then(function(t){e.postId=t.key,console.log("what is post id? ",t.key),e.data.newTag=""})},e.deleteTag=function(t){e.tags.$remove(t).then(function(e){e.key===t.$id})},e.resetMedia=function(){e.data.youtube="",e.data.image=""},e.submit=function(){"image"===e.data.mediaSelect&&e.data.image?r(e.post,e.postArray,e.data.image,f):"image"!==e.data.mediaSelect||e.data.image?"youtube"===e.data.mediaSelect&&(e.data.youtube=l.parseYouTube(e.data.youtube),f(e.post,e.BlogPosts,null,e.data.youtube)):f(e.post,e.BlogPosts,e.post.img,null)};var f=function(o,s,n,i){var r=l.slugify(o.postTitle);console.log(r);var g=moment(o.timestamp).format("YYYY"),d=moment(o.timestamp).format("MMMM"),u={};for(var m in o.tags)u[m]=o.tags[m];o.slug=r,o.tags=u,o.youtube=i?i:null,o.img=n?n:null;var c={postTitle:o.postTitle,slug:r,postBody:o.postBody,youtube:o.youtube,img:o.img,tags:u,timestamp:o.timestamp};e.postArray.$save(o).then(function(o){var s=o.key;firebase.database().ref("archives/"+g+"/"+d+"/"+s).remove(),firebase.database().ref("archives/"+g+"/"+d+"/"+s).set(c);for(m in e.originalTags)if(e.originalTags[m]===!0){var n="tags/"+m+"/posts/"+s;firebase.database().ref(n).remove().then(function(e){}).catch(function(e){console.log("Remove failed: "+e.message)})}else console.log(m+" not a tag for old edit!");a(function(){for(m in c.tags)c.tags[m]===!0?firebase.database().ref("tags/"+m+"/posts/"+s).set(c):console.log(m+" not a tag for new edit!")},100),t.go("blog.main")})}}]).controller("EditBlogTagsCtrl",["$scope","$uibModalInstance","tag","Blog",function(e,t,a,o){e.prompted=!1,e.tag=angular.copy(a),console.log(a),e.ok=function(a){var o={name:e.tag.name};firebase.database().ref("/tags/"+e.tag.$id).update(o),t.close()},e.cancel=function(){t.dismiss("cancel")},e.deletePrompt=function(){e.prompted=!0},e.delete=function(a){if("no"===a)e.prompted=!1;else if("yes"===a){firebase.database().ref("/tags/"+e.tag.$id).remove();for(var s=0;s<o.length;s++){var n=o[s].tags;n[e.tag.$id]===!0&&(n[e.tag.$id]=null,firebase.database().ref("/blog_posts/"+o[s].$id+"/tags").update(n))}t.close()}}}]).controller("DeleteBlogConfirmCtrl",["$scope","$uibModalInstance","Post","moment","$location",function(e,t,a,o,s){console.log(a),e.yes=function(){var e=o(a.timestamp).format("YYYY"),n=o(a.timestamp).format("MMMM");console.log(n+" of "+e),firebase.database().ref("blog_posts/"+a.$id).remove(),firebase.database().ref("archives/"+e+"/"+n+"/"+a.$id).remove(),t.close(),s.url("/blog")},e.no=function(){t.dismiss("cancel")}}]);