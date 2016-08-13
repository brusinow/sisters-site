angular.module("SistersApp", ['SistersCtrls','SistersDirectives','ui.router'])

.config(['$stateProvider', '$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider,$locationProvider){
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'app/views/home.html',
    controller: 'HomeCtrl'
  })
  .state('about', {
    url: '/about',
    templateUrl: 'app/views/about.html',
    controller: 'AboutCtrl'
  })
  .state('shows', {
    url: '/shows',
    templateUrl: 'app/views/shows.html',
    controller: 'ShowsCtrl'
  })
  
 $locationProvider.html5Mode(true);


}])