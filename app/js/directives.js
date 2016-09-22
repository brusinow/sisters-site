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




