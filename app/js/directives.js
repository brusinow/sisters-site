angular.module('SistersDirectives', [])




.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}])

.directive('centsToDollars', [
		function() {
				return {
  				require: 'ngModel',
					link: function (elem, $scope, attrs, ngModel) {
						ngModel.$formatters.push(function (val) {
							return '$' + (val / 100).toFixed(2);
						});
						ngModel.$parsers.push(function (val) {
							//make sure the val is string
							val = val.toString();
							//filter the value for displaying, so keep the '$'
							var displayedValue = val.replace(/[^\d\.\$]/g, '');
							var replaced = val.replace(/[^\d\.]/g, '');
							var split = replaced.split('.');
							var merged = split[0] + split[1].slice(0, 2);
							var typeConverted = Number(merged);
							//update the $viewValue
              ngModel.$setViewValue(displayedValue);
              //reflect on the DOM element
              ngModel.$render();
							return typeConverted;
						});
					}
				}
			}
])

.directive("countryName", ['$http', function($http) {
  return {
    template: "<span>{{name}}</span>",
    scope: {
      countryCode: "="
    },
    link: function(scope) {
      $http.get('/js/JSON/countries.json').then(function(data) {
        var countries = data.data;
        for (var i = 0; i < countries.length; i++){
            if (countries[i].code === scope.countryCode){
                scope.name = countries[i].name;
                break;
            }
        }
      }, function(err) {
        scope.name = "unknown";
      });
    }
  }
}]);




