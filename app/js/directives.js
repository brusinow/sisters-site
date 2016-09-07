angular.module('SistersDirectives', [])

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




