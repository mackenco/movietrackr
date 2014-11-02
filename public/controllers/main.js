angular.module('MyApp')
  .controller('MainCtrl', ['$scope', 'Movie', function($scope, Movie) {

    $scope.alphabet = ['0-9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
      'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
      'Y', 'Z'];

    $scope.genres = ['Action', 'Adventure', 'Animation', 'Comedy',
      'Crime', 'Disaster', 'Documentary', 'Drama', 'Eastern', 'Erotic', 'Family',
      'Fan Film', 'Fantasy', 'Film Noir', 'Foreign', 'History', 'Holiday',
      'Horror', 'Indie', 'Music', 'Musical', 'Mystery', 'Neo-noir', 'Road Movie',
      'Romance', 'Science Fiction', 'Short', 'Sport', 'Sporting Event', 'Sports Film',
      'Suspense', 'TV movie', 'Thriller', 'War', 'Western'];

    $scope.headingTitle = 'Top 12 Movies';
    $scope.selected = false;

    $scope.movies = Movie.query();

    $scope.filterByGenre = function(genre) {
      $scope.movies = Movie.query({ genre: genre });
      $scope.headingTitle = genre;
      $scope.selected = true;
    };

    $scope.filterByAlphabet = function(char) {
      $scope.movies = Movie.query({ alphabet: char });
      $scope.headingTitle = char;
      $scope.selected = true;
    };

    $scope.clear = function() {
      $scope.headingTitle = 'Top 12 movies';
      $scope.movies = Movie.query();
      $scope.selected = false;
    };

  }]);
