var express = require('express'),
  path = require('path'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  bcrypt = require('bcryptjs');

var movieSchema = new mongoose.Schema({
  id: Number,
  adult: Boolean,
  backdrop_path: String,
  budget: Number,
  genres: [{ name: String }],
  homepage: String,
  imdb_id: String,
  original_title: String,
  overview: String,
  popularity: Number,
  poster: String,
  poster_path: String,
  production_companies: [{ name: String }],
  production_countries: [{ name: String }],
  release_date: Date,
  revenue: Number,
  runtime: Number,
  spoken_languages: [{ name: String }],
  status: String,
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }],
  tagline: String,
  title: String
});


var userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);
var Movie = mongoose.model('Movie', movieSchema);

mongoose.connect('localhost');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/movies', function(req, res, next) {
  var query = Movie.find();
  if (req.query.genre) {
      query.where({ genre: req.query.genre });
    } else if (req.query.alphabet) {
        query.where({ name: new RegExp('^' + '[' + req.query.alphabet + ']', 'i') });
      } else {
          query.limit(12);
        }
  query.exec(function(err, movies) {
      if (err) return next(err);
      res.send(movies);
    });
});

app.get('/api/movies/:id', function(req, res, next) {
  Movie.findById(req.params.id, function(err, movie) {
      if (err) return next(err);
      res.send(movie);
    });
});

app.post('/api/movies', function(req, res, next) {
  var apiKey = '7f8fc174ebc84511d4db81d8133a5d68',
      movieName = encodeURIComponent(req.body.movieName);

  async.waterfall([
    function(callback) {
      request.get('http://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=' + movieName, function(error, response, body) {
        if (error) return next(error);
        if (body.results.length === 0) return res.send(404, { message: req.body.movieName + ' was not found.' });
        var movieId = body.results[0].id;
        callback(err, movieId);
      });
    },
    function(movieId, callback) {
      request.get('http://api.themoviedb.org/3/movie/' + movieId + '?api_key=' + apiKey, function(error, response, body) {
        if (error) return next(error);
        var movie = new Movie(body);
        callback(err, movie);
      });
    },
    function(movie, callback) {
      var url = 'http://image.tmdb.org/t/p/w185' + movie.poster_path;
      request({ url: url, encoding: null }, function(error, response, bnody) {
        movie.poster = 'data:' + response.headers['content-type'] + ';base64,' + body.toString('base64');
        callback(error, movie); 
      });
    }
    ], function(err, movie) {
      if (err) return next(err);
      movie.save(function(err) {
        if (err) {
          if (err.code == 11000) return res.send(409, { message: movie.name + ' already exists.' });
          return next(err);
        }
        res.send(200);
      });
    });
});

app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { message: err.message });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
