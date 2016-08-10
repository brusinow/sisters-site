angular.module('SistersApp', ['SistersCtrls','ui.router','ui.bootstrap'])

.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise('/404');

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'views/home.html',
    controller: 'HomeCtrl'
  })
  .state('shows', {
    url: '/shows',
    templateUrl: 'views/shows.html',
    controller: 'ShowsCtrl'
  })
  .state('404', {
    url: '/404',
    templateUrl: './views/404.html'
  })

   $locationProvider.html5Mode(true);





// .config(['$httpProvider', function($httpProvider) {
//   $httpProvider.interceptors.push('AuthInterceptor');
}])