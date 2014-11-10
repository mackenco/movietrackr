angular.module('MyApp')
  .controller('DetailCtrl', ['$scope', '$rootScope', '$routeParams', 'Movie', 'Review', function($scope, $rootScope, $routeParams, Movie, Review) {
    $scope.venues = ['Theater', 'DVD', 'Netflix', 'Bootleg', 'Airplane'].sort();

    Movie.get({ _id: $routeParams.id }, function(movie) {
      $scope.movie = movie;
    });
  }]);
