angular.module('MyApp')
  .factory('Review', ['$http', function($http) {
    return {
      review : function(movie, user) {
        return $http.post('/api/review', { movieId: movie.id });        
      }
    };
  }]);
