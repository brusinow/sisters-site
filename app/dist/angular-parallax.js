"use strict";angular.module("angular-parallax",[]).directive("parallax",["$window",function($window){return{restrict:"A",scope:{parallaxRatio:"@",parallaxVerticalOffset:"@",parallaxHorizontalOffset:"@"},link:function($scope,elem,attrs){var setPosition=function(){$scope.parallaxHorizontalOffset||($scope.parallaxHorizontalOffset="0");var calcValY=$window.pageYOffset*($scope.parallaxRatio?$scope.parallaxRatio:1.1);if(calcValY<=$window.innerHeight){var topVal=calcValY<$scope.parallaxVerticalOffset?$scope.parallaxVerticalOffset:calcValY,hozVal=-1===$scope.parallaxHorizontalOffset.indexOf("%")?$scope.parallaxHorizontalOffset+"px":$scope.parallaxHorizontalOffset;elem.css("transform","translate("+hozVal+", "+topVal+"px)")}};setPosition(),angular.element($window).bind("scroll",setPosition),angular.element($window).bind("touchmove",setPosition)}}}]).directive("parallaxBackground",["$window",function($window){return{restrict:"A",transclude:!0,template:"<div ng-transclude></div>",scope:{parallaxRatio:"@",parallaxVerticalOffset:"@",parallaxStartPoint:"@"},link:function($scope,elem,attrs){var setPosition=function(){var offset=$scope.parallaxVerticalOffset/100*elem[0].offsetHeight,calcValY=(elem.prop("offsetTop")-$window.pageYOffset)*($scope.parallaxRatio?$scope.parallaxRatio:1.1)-(offset||0);calcValY>=$scope.parallaxStartPoint&&(calcValY=$scope.parallaxStartPoint),elem.css("background-position","50% "+calcValY+"px")};angular.element($window).bind("load",function(e){setPosition(),$scope.$apply()}),angular.element($window).bind("scroll",setPosition),angular.element($window).bind("touchmove",setPosition)}}}]);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXItcGFyYWxsYXguanMiXSwibmFtZXMiOlsiYW5ndWxhciIsIm1vZHVsZSIsImRpcmVjdGl2ZSIsIiR3aW5kb3ciLCJyZXN0cmljdCIsInNjb3BlIiwicGFyYWxsYXhSYXRpbyIsInBhcmFsbGF4VmVydGljYWxPZmZzZXQiLCJwYXJhbGxheEhvcml6b250YWxPZmZzZXQiLCJsaW5rIiwiJHNjb3BlIiwiZWxlbSIsImF0dHJzIiwic2V0UG9zaXRpb24iLCJjYWxjVmFsWSIsInBhZ2VZT2Zmc2V0IiwiaW5uZXJIZWlnaHQiLCJ0b3BWYWwiLCJob3pWYWwiLCJpbmRleE9mIiwiY3NzIiwiZWxlbWVudCIsImJpbmQiLCJ0cmFuc2NsdWRlIiwidGVtcGxhdGUiLCJwYXJhbGxheFN0YXJ0UG9pbnQiLCJvZmZzZXQiLCJvZmZzZXRIZWlnaHQiLCJwcm9wIiwiZSIsIiRhcHBseSJdLCJtYXBwaW5ncyI6IkFBQUEsWUFFQUEsU0FBUUMsT0FBTyx1QkFDWkMsVUFBVSxZQUFhLFVBQVcsU0FBU0MsU0FDNUMsT0FDRUMsU0FBVSxJQUNWQyxPQUNFQyxjQUFlLElBQ2ZDLHVCQUF3QixJQUN4QkMseUJBQTBCLEtBRTVCQyxLQUFNLFNBQVNDLE9BQVFDLEtBQU1DLE9BQzNCLEdBQUlDLGFBQWMsV0FDWkgsT0FBT0YsMkJBQTBCRSxPQUFPRix5QkFBMkIsSUFDdkUsSUFBSU0sVUFBV1gsUUFBUVksYUFBZUwsT0FBT0osY0FBZ0JJLE9BQU9KLGNBQWdCLElBQ3BGLElBQUlRLFVBQVlYLFFBQVFhLFlBQWEsQ0FDbkMsR0FBSUMsUUFBVUgsU0FBV0osT0FBT0gsdUJBQXlCRyxPQUFPSCx1QkFBeUJPLFNBQ3JGSSxRQUE0RCxJQUFsRFIsT0FBT0YseUJBQXlCVyxRQUFRLEtBQWNULE9BQU9GLHlCQUEyQixLQUFPRSxPQUFPRix3QkFDcEhHLE1BQUtTLElBQUksWUFBYSxhQUFlRixPQUFTLEtBQU9ELE9BQVMsUUFJbEVKLGVBRUFiLFFBQVFxQixRQUFRbEIsU0FBU21CLEtBQUssU0FBVVQsYUFDeENiLFFBQVFxQixRQUFRbEIsU0FBU21CLEtBQUssWUFBYVQsa0JBRzdDWCxVQUFVLHNCQUF1QixVQUFXLFNBQVNDLFNBQ3ZELE9BQ0VDLFNBQVUsSUFDVm1CLFlBQVksRUFDWkMsU0FBVSw0QkFDVm5CLE9BQ0VDLGNBQWUsSUFDZkMsdUJBQXdCLElBQ3hCa0IsbUJBQW9CLEtBRXRCaEIsS0FBTSxTQUFTQyxPQUFRQyxLQUFNQyxPQUMzQixHQUFJQyxhQUFjLFdBQ2hCLEdBQUlhLFFBQVVoQixPQUFPSCx1QkFBdUIsSUFBT0ksS0FBSyxHQUFHZ0IsYUFDdkRiLFVBQVlILEtBQUtpQixLQUFLLGFBQWV6QixRQUFRWSxjQUFnQkwsT0FBT0osY0FBZ0JJLE9BQU9KLGNBQWdCLE1BQVFvQixRQUFVLEVBRTdIWixXQUFZSixPQUFPZSxxQkFDckJYLFNBQVdKLE9BQU9lLG9CQUVwQmQsS0FBS1MsSUFBSSxzQkFBdUIsT0FBU04sU0FBVyxNQUl0RGQsU0FBUXFCLFFBQVFsQixTQUFTbUIsS0FBSyxPQUFRLFNBQVNPLEdBQzdDaEIsY0FDQUgsT0FBT29CLFdBR1Q5QixRQUFRcUIsUUFBUWxCLFNBQVNtQixLQUFLLFNBQVVULGFBQ3hDYixRQUFRcUIsUUFBUWxCLFNBQVNtQixLQUFLLFlBQWFUIiwiZmlsZSI6ImFuZ3VsYXItcGFyYWxsYXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyLXBhcmFsbGF4JywgW1xuXSkuZGlyZWN0aXZlKCdwYXJhbGxheCcsIFsnJHdpbmRvdycsIGZ1bmN0aW9uKCR3aW5kb3cpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHNjb3BlOiB7XG4gICAgICBwYXJhbGxheFJhdGlvOiAnQCcsXG4gICAgICBwYXJhbGxheFZlcnRpY2FsT2Zmc2V0OiAnQCcsXG4gICAgICBwYXJhbGxheEhvcml6b250YWxPZmZzZXQ6ICdAJyxcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbSwgYXR0cnMpIHtcbiAgICAgIHZhciBzZXRQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYoISRzY29wZS5wYXJhbGxheEhvcml6b250YWxPZmZzZXQpICRzY29wZS5wYXJhbGxheEhvcml6b250YWxPZmZzZXQgPSAnMCc7XG4gICAgICAgIHZhciBjYWxjVmFsWSA9ICR3aW5kb3cucGFnZVlPZmZzZXQgKiAoJHNjb3BlLnBhcmFsbGF4UmF0aW8gPyAkc2NvcGUucGFyYWxsYXhSYXRpbyA6IDEuMSApO1xuICAgICAgICBpZiAoY2FsY1ZhbFkgPD0gJHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgICAgIHZhciB0b3BWYWwgPSAoY2FsY1ZhbFkgPCAkc2NvcGUucGFyYWxsYXhWZXJ0aWNhbE9mZnNldCA/ICRzY29wZS5wYXJhbGxheFZlcnRpY2FsT2Zmc2V0IDogY2FsY1ZhbFkpO1xuICAgICAgICAgIHZhciBob3pWYWwgPSAoJHNjb3BlLnBhcmFsbGF4SG9yaXpvbnRhbE9mZnNldC5pbmRleE9mKFwiJVwiKSA9PT0gLTEgPyAkc2NvcGUucGFyYWxsYXhIb3Jpem9udGFsT2Zmc2V0ICsgJ3B4JyA6ICRzY29wZS5wYXJhbGxheEhvcml6b250YWxPZmZzZXQpO1xuICAgICAgICAgIGVsZW0uY3NzKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBob3pWYWwgKyAnLCAnICsgdG9wVmFsICsgJ3B4KScpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBzZXRQb3NpdGlvbigpO1xuXG4gICAgICBhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykuYmluZChcInNjcm9sbFwiLCBzZXRQb3NpdGlvbik7XG4gICAgICBhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykuYmluZChcInRvdWNobW92ZVwiLCBzZXRQb3NpdGlvbik7XG4gICAgfSAgLy8gbGluayBmdW5jdGlvblxuICB9O1xufV0pLmRpcmVjdGl2ZSgncGFyYWxsYXhCYWNrZ3JvdW5kJywgWyckd2luZG93JywgZnVuY3Rpb24oJHdpbmRvdykge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZTogJzxkaXYgbmctdHJhbnNjbHVkZT48L2Rpdj4nLFxuICAgIHNjb3BlOiB7XG4gICAgICBwYXJhbGxheFJhdGlvOiAnQCcsXG4gICAgICBwYXJhbGxheFZlcnRpY2FsT2Zmc2V0OiAnQCcsXG4gICAgICBwYXJhbGxheFN0YXJ0UG9pbnQ6ICdAJ1xuICAgIH0sXG4gICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCBlbGVtLCBhdHRycykge1xuICAgICAgdmFyIHNldFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gKCRzY29wZS5wYXJhbGxheFZlcnRpY2FsT2Zmc2V0LzEwMCkgKiBlbGVtWzBdLm9mZnNldEhlaWdodDsgXG4gICAgICAgIHZhciBjYWxjVmFsWSA9IChlbGVtLnByb3AoJ29mZnNldFRvcCcpIC0gJHdpbmRvdy5wYWdlWU9mZnNldCkgKiAoJHNjb3BlLnBhcmFsbGF4UmF0aW8gPyAkc2NvcGUucGFyYWxsYXhSYXRpbyA6IDEuMSkgLSAob2Zmc2V0IHx8IDApO1xuICAgICAgICAvLyBob3Jpem9udGFsIHBvc2l0aW9uaW5nXG4gICAgICAgIGlmIChjYWxjVmFsWSA+PSAkc2NvcGUucGFyYWxsYXhTdGFydFBvaW50KXtcbiAgICAgICAgICBjYWxjVmFsWSA9ICRzY29wZS5wYXJhbGxheFN0YXJ0UG9pbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbS5jc3MoJ2JhY2tncm91bmQtcG9zaXRpb24nLCBcIjUwJSBcIiArIGNhbGNWYWxZICsgXCJweFwiKTtcbiAgICAgIH07XG5cbiAgICAgIC8vIHNldCBvdXIgaW5pdGlhbCBwb3NpdGlvbiAtIGZpeGVzIHdlYmtpdCBiYWNrZ3JvdW5kIHJlbmRlciBidWdcbiAgICAgIGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5iaW5kKCdsb2FkJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBzZXRQb3NpdGlvbigpO1xuICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICB9KTtcblxuICAgICAgYW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLmJpbmQoXCJzY3JvbGxcIiwgc2V0UG9zaXRpb24pO1xuICAgICAgYW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLmJpbmQoXCJ0b3VjaG1vdmVcIiwgc2V0UG9zaXRpb24pO1xuICAgIH0gIC8vIGxpbmsgZnVuY3Rpb25cbiAgfTtcbn1dKTtcbiJdfQ==
