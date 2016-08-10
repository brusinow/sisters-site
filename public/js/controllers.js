angular.module('SistersCtrls', ['SistersServices'])

.controller('HomeCtrl', ['$scope', function($scope){
  $scope.location = "I'm on the home page!!!!!!!";

}])

.controller('ShowsCtrl', ['$scope', function($scope){
  $scope.location = "I'm on the shows page!!!!!!!";
}])