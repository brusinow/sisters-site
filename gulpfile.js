
var gulp = require('gulp')
var concat = require('gulp-concat')
var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps')
var uglify = require('gulp-uglify')
var ngAnnotate = require('gulp-ng-annotate')

gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('js', function () {
  gulp.src(['app/js/app.js','app/js/controllers/*.js','app/js/directives.js','app/js/services.js'])
    .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(ngAnnotate())
      .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/dist'))
})

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('app/js/*.js', ['lint','js']);
    gulp.watch('app/js/controllers/*.js', ['lint','js']);
});

// Default Task
gulp.task('default', ['lint', 'js', 'watch']);