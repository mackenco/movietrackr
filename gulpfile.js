var gulp = require('gulp'),
  sass = require('gulp-sass'),
  plumber = require('gulp-plumber'),
  csso = require('gulp-csso'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  templateCache = require('gulp-angular-templatecache'),
  jshint = require('gulp-jshint');

//@todo - add todos
gulp.task('sass', function() {
  gulp.src('public/stylesheets/style.scss')
      .pipe(plumber())
      .pipe(sass())
      .pipe(csso())
      .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('lint', function() {
  return gulp.src([
      'server.js',
      'gulpfile.js',
      'public/app.js',
      'public/services/*.js',
      'public/controllers/*.js',
      'public/filters/*.js',
      'public/directives/*.js'  
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('compress', function() {
  gulp.src([
    'public/vendor/angular.js',
    'public/vendor/*.js',
    'public/app.js',
    'public/services/*.js',
    'public/controllers/*.js',
    'public/filters/*.js',
    'public/directives/*.js'  
    ])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public'));
});

gulp.task('templates', function() {
  gulp.src('public/views/**/*.html')
    .pipe(templateCache({ root: 'views', module: 'MyApp' }))
    .pipe(gulp.dest('public'));
});

gulp.task('watch', function() {
  gulp.watch('public/stylesheets/*.scss', ['sass']);
  gulp.watch('public/views/**/*.html', ['templates']);
  gulp.watch(['public/**/*.js', '!public/app.min.js', '!public/templates.js', '!public/vendor'], ['compress']);
  gulp.watch(['server.js', 'gulpfile.js', 'public/*.js', 'public/**/*.js', '!public/app.min.js', '!public/vendor']);
});

gulp.task('default', ['sass', 'lint', 'compress', 'templates', 'watch']);
