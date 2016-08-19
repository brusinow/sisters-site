var authWait = ["Auth", function(Auth) { return Auth.$waitForSignIn(); }]
var authRequire = ["Auth", function(Auth) { return Auth.$requireSignIn(); }]

angular.module("SistersApp", ['SistersCtrls','SistersDirectives','ui.router','ui.bootstrap','firebase','angularMoment'])

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
    url: '/blog',
    templateUrl: '/views/blog.html',
    controller: 'BlogCtrl',
    resolve: {
      "currentAuth": authWait,
      "Instagram": ['InstagramFactory', function(InstagramFactory){
        return InstagramFactory;
      }]
    }
  })
  .state('blog-new', {
    url: '/blog/new',
    templateUrl: '/views/newBlogPost.html',
    controller: 'NewBlogCtrl',
    resolve: {
      "currentAuth": authRequire
    }
  })

  .state('shows', {
    url: '/shows',
    templateUrl: '/views/shows.html',
    controller: 'ShowsCtrl',
    resolve: {
      "currentAuth": authWait,
      getShows: function(GetShows){
        console.log("app resolve entered");
        return GetShows().$loaded();
      }
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
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

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