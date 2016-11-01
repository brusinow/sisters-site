'use strict';

angular.module('angular-parallax', [
]).directive('parallax', ['$window', function($window) {
  return {
    restrict: 'A',
    scope: {
      parallaxRatio: '@',
      parallaxVerticalOffset: '@',
      parallaxHorizontalOffset: '@',
    },
    link: function($scope, elem, attrs) {
      var setPosition = function () {
        if(!$scope.parallaxHorizontalOffset) $scope.parallaxHorizontalOffset = '0';
        var calcValY = $window.pageYOffset * ($scope.parallaxRatio ? $scope.parallaxRatio : 1.1 );
        if (calcValY <= $window.innerHeight) {
          var topVal = (calcValY < $scope.parallaxVerticalOffset ? $scope.parallaxVerticalOffset : calcValY);
          var hozVal = ($scope.parallaxHorizontalOffset.indexOf("%") === -1 ? $scope.parallaxHorizontalOffset + 'px' : $scope.parallaxHorizontalOffset);
          elem.css('transform', 'translate(' + hozVal + ', ' + topVal + 'px)');
        }
      };

      setPosition();

      angular.element($window).bind("scroll", setPosition);
      angular.element($window).bind("touchmove", setPosition);
    }  // link function
  };
}]).directive('parallaxBackground', ['$window', function($window) {
  return {
    restrict: 'A',
    transclude: true,
    template: '<div ng-transclude></div>',
    scope: {
      parallaxRatio: '@',
      parallaxVerticalOffset: '@',
      parallaxStartPoint: '@'
    },
    link: function($scope, elem, attrs) {
      var setPosition = function () {
        var offset = ($scope.parallaxVerticalOffset/100) * elem[0].offsetHeight; 
        var calcValY = (elem.prop('offsetTop') - $window.pageYOffset) * ($scope.parallaxRatio ? $scope.parallaxRatio : 1.1) - (offset || 0);
        // horizontal positioning
        if (calcValY >= $scope.parallaxStartPoint){
          calcValY = $scope.parallaxStartPoint;
        }
        elem.css('background-position', "50% " + calcValY + "px");
      };

      // set our initial position - fixes webkit background render bug
      angular.element($window).bind('load', function(e) {
        setPosition();
        $scope.$apply();
      });

      angular.element($window).bind("scroll", setPosition);
      angular.element($window).bind("touchmove", setPosition);
    }  // link function
  };
}]);
