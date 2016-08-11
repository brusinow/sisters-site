angular.module('SistersDirectives', [])

.directive('navbar', function () {
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: false,
        templateUrl: "../views/header.html",
        controller: ['$scope', '$filter', function ($scope, $filter) {
          console.log("anything yet?");
            $scope.isMobile = function(){
              console.log("current width: ",window.innerWidth);
              if (window.innerWidth <= 768){
                return true;
              } else {
                return false;
              }
            }
        }]
    }
  });