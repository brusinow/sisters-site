angular.module('SistersServices', ['ngResource'])

.factory('FilmsFactory', ['$resource', function($resource) {
  return $resource('http://swapi.co/api/films/:id', {}, {
    all: {params: {id: undefined}, isArray: false},
    query: {params: {id: 1}, isArray: false}
  });
}])

.factory('LoadedService', function() {
 var loaded = false;
 function set(data) {
   loaded = data;
 }
 function get() {
  return loaded;
 }

 return {
  set: set,
  get: get
 }

})