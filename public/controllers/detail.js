angular.module('MyApp')
  .controller('DetailCtrl', ['$scope', '$rootScope', '$routeParams', 'Movie', 'Review', function($scope, $rootScope, $routeParams, Movie, Review) {
    Movie.get({ _id: $routeParams.id }, function(movie) {
      $scope.movie = movie;
      console.log($scope.movie);
    });
  }]);
