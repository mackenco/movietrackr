angular.module('MyApp')
  .factory('Movie', ['$resource', function($resource) {
    return $resource('/api/movies/:_id');
  }]);
