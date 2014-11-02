angular.module('MyApp')
  .controller('AddCtrl', ['$scope', '$alert', 'Movie', function($scope, $alert, Movie) {
    $scope.addMovie = function() {
      Movie.save({ movieName: $scope.movieName },
        function() {
          $scope.movieName = '';
          $scope.addForm.$setPristine();
          $alert({
            content: 'Movie has been added.',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
        },
        function(response) {
          $scope.movieName = '';
          $scope.addForm.$setPristine();
          $alert({
            content: response.data.message,
            placement: 'top-right',
            type: 'danger',
            duration: 3
          });
        });
    };
  }]);
