
var gulp = require('gulp');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var cssmin = require('gulp-cssmin');
var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var gzip = require('gulp-gzip');

gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('libJs', function () {
  gulp.src(['app/lib/angular-parallax.js','app/components/angular-file-saver/dist/angular-file-saver.bundle.js', 'app/lib/metatags/ui-router-metatags.js','app/lib/angular-fontawesome.js', 'app/lib/buttons.js','app/components/angular-timer/dist/angular-timer.js'])
    .pipe(sourcemaps.init())
      .pipe(ngAnnotate())
      .pipe(uglify({mangle: false}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/dist/'))
})

gulp.task('myJs', function () {
  gulp.src(['app/js/app.js','app/js/controllers/*.js','app/js/directives.js','app/js/services/*.js'])
    .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(ngAnnotate())
      .pipe(uglify({mangle: false}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/dist'))
})

gulp.task('css', function () {
  return gulp.src(['app/css/normalize.css','app/css/skeleton.css','app/css/store-layout.css','app/components/textAngular/dist/textAngular.css','app/css/font-awesome.css', 'app/css/buttons.css', 'app/css/style.css'])
    .pipe(concatCss('bundle.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('app/dist'))
});

// Watch Files For Changes
gulp.task('watch', function() {
    console.log("gulp watch!!!!");
    gulp.watch('app/js/*.js', ['lint','myJs']);
    gulp.watch('app/js/controllers/*.js', ['lint','myJs']);
    gulp.watch('app/js/services/*.js', ['lint','myJs']);
    gulp.watch('app/css/*.css', ['css'])
});

// Default Task
gulp.task('default', ['lint', 'css', 'myJs','libJs', 'watch']);
