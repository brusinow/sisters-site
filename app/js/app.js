var authWait = ["Auth", function(Auth) { return Auth.$waitForSignIn(); }]
var authRequire = ["Auth", function(Auth) { return Auth.$requireSignIn(); }]

angular.module("SistersApp", ['SistersCtrls','SistersDirectives','ui.router','ui.bootstrap','firebase','angularMoment','ngCart','ngStorage','angularPayments'])

.run(["$rootScope", "$state", function($rootScope, $state) {
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $state.go("login");
    }
  });
}])



.config(['$stateProvider', '$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider,$locationProvider){
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: '/views/home.html',
    controller: 'HomeCtrl'
  })
  .state('about', {
    url: '/about',
    templateUrl: '/views/about.html',
    controller: 'AboutCtrl'
  })
  .state('blog', {
    templateUrl: '/views/blog/blog.html',
    controller: 'BlogCtrl',
    resolve: {
      "currentAuth": authWait,
      "Instagram": ['InstagramFactory', function(InstagramFactory){
        return InstagramFactory;
      }],
      "Blog": function(BlogPosts){
        return BlogPosts().$loaded();
      }      
    }
  })
  .state('blog.main', {
    url: '/blog',
    templateUrl: '/views/blog/blog-content.html',
    controller: 'BlogCtrl',
    resolve: {
      "currentAuth": authWait,
      "Instagram": ['InstagramFactory', function(InstagramFactory){
        return InstagramFactory;
      }],
      "Blog": function(BlogPosts){
        return BlogPosts().$loaded();
      }      
    }
  })
    .state('blog.page', {
    url: '/blog/:page',
    templateUrl: '/views/blog/blog-content.html',
    controller: 'BlogCtrl',
    resolve: {
      "currentAuth": authWait,
      "Instagram": ['InstagramFactory', function(InstagramFactory){
        return InstagramFactory;
      }],
      "Blog": function(BlogPosts){
        return BlogPosts().$loaded();
      }      
    }
  })

     .state('blog.archive', {
    url: '/blog/archives/:year/:month',
    templateUrl: '/views/blog/blog-content.html',
    controller: 'BlogArchiveCtrl',
    resolve: {
      "currentAuth": authWait,
      "Instagram": ['InstagramFactory', function(InstagramFactory){
        return InstagramFactory;
      }],
      "Blog": function(BlogPosts){
        return BlogPosts().$loaded();
      },
      "Archive": function($stateParams, ArchiveShowService){
        return ArchiveShowService($stateParams.year, $stateParams.month).$loaded();
      }      
    }
  })

    .state('blog.archivePage', {
      url: '/blog/archives/:year/:month/:page',
      templateUrl: '/views/blog/blog-content.html',
      controller: 'BlogArchiveCtrl',
      resolve: {
        "currentAuth": authWait,
        "Instagram": ['InstagramFactory', function(InstagramFactory){
          return InstagramFactory;
        }],
        "Blog": function(BlogPosts){
          return BlogPosts().$loaded();
        },
        "Archive": function($stateParams, ArchiveShowService){
          return ArchiveShowService($stateParams.year, $stateParams.month).$loaded();
        }

      }
    })

    .state('blog.tags', {
    url: '/blog/tags/:tagName',
    templateUrl: '/views/blog/blog-content.html',
    controller: 'BlogTagsCtrl',
    resolve: {
      "currentAuth": authWait,
      "Instagram": ['InstagramFactory', function(InstagramFactory){
        return InstagramFactory;
      }],
      "Blog": function(BlogPosts){
        return BlogPosts().$loaded();
      },
      "TagsShow": function($stateParams, TagsShowService){
        return TagsShowService($stateParams.tagName).$loaded();
      }      
    }
  })



  .state('blog.show', {
    url: '/blog/show/:slug',
    templateUrl: '/views/blog/blog-content.html',
    controller: 'BlogShowCtrl',
    resolve: {
      "currentAuth": authWait,
      "Instagram": ['InstagramFactory', function(InstagramFactory){
        return InstagramFactory;
      }],
      "thisPost": function($stateParams, ThisPostService){        
        return ThisPostService($stateParams.slug).$loaded();
      },
      "Blog": function(BlogPosts){
        return BlogPosts().$loaded();
      }       
    }
  })
  

  .state('blog-new', {
    url: '/blog/new',
    templateUrl: '/views/blog/newBlogPost.html',
    controller: 'NewBlogCtrl',
    resolve: {
      "currentAuth": authRequire,
      "AllTags": function(AllTagsService){
        return AllTagsService().$loaded();
      }
    }
  })
  .state('blog-edit', {
    url: '/blog/edit/:slug',
    templateUrl: '/views/blog/editBlogPost.html',
    controller: 'EditBlogCtrl',
    resolve: {
      "currentAuth": authRequire,
      "AllTags": function(AllTagsService){
        return AllTagsService().$loaded();
      },
      "thisPost": function($stateParams, ThisPostService){
        return ThisPostService($stateParams.slug).$loaded();
      }
    }
  })


 



  



  .state('shows', {
    url: '/shows',
    templateUrl: '/views/shows/shows.html',
    controller: 'ShowsCtrl',
    resolve: {
      "currentAuth": authWait,
      getShows: function(GetShows){
        console.log("app resolve entered");
        return GetShows().$loaded();
      }
    }
  })
  .state('store', {
    url: '/store',
    templateUrl: '/views/store/store.html',
    controller: 'StoreCtrl',
    resolve: {
      "currentAuth": authWait
    }
  })
  .state('storeCart', {
    url: '/store/cart',
    templateUrl: '/views/store/cart.html',
    controller: 'StoreCtrl',
    resolve: {
      "currentAuth": authWait
    }
  })
  .state('storeCheckout', {
    url: '/store/checkout',
    templateUrl: '/views/store/checkoutAddress.html',
    controller: 'StoreCheckoutCtrl',
    resolve: {
      "currentAuth": authWait
    }
  })
  .state('storePayment', {
    url: '/store/payment',
    templateUrl: '/views/store/checkoutPayment.html',
    controller: 'StorePaymentCtrl',
    resolve: {
      "currentAuth": authWait
    }
  })
   .state('storeConfirm', {
    url: '/store/confirm',
    templateUrl: '/views/store/checkoutConfirm.html',
    controller: 'StoreConfirmCtrl',
    resolve: {
      "currentAuth": authWait
    }
  })
  .state('login', {
    url: '/login',
    templateUrl: '/views/login.html',
    controller: 'LoginCtrl'
  })

  
  $locationProvider.html5Mode(true);

}])

.filter('cut', function () {
  return function (value, enable, wordwise, max, tail) {
    if (!value) return '';
    if (value && !enable) {
      return value;
    } else if (value && enable){
      console.log("value and enable");
      max = parseInt(max, 10);
      if (!max) {
        return value;
      }
      if (value.length <= max){
        console.log("should not include tail!!!")
        return value;
      } 

      value = value.substr(0, max);
      if (wordwise) {
        var lastspace = value.lastIndexOf(' ');
        if (lastspace != -1) {
          //Also remove . and , so its gives a cleaner result.
          if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
            lastspace = lastspace - 1;
          }
          value = value.substr(0, lastspace);
        }
      }

      return value + (tail || '…');
    }
  };
})

.filter('trustAsResourceUrl', ['$sce', function($sce) {
  return function(val) {
    return $sce.trustAsResourceUrl('http://www.youtube.com/embed/'+val);
  };
}])


.filter('MomentFilter', ['moment', function(moment){
  return function(val){
    return  moment(val).format('MMMM Do, YYYY');
  }
}]);

