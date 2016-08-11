angular.module("SistersApp", ['SistersCtrls', 'ui.router'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
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
  
  // $locationProvider.html5Mode(false).hashPrefix('!');


}])