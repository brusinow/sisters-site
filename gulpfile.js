'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var ngAnnotate = require('gulp-ng-annotate')



gulp.task('watch', function(){
  var watcher = gulp.watch('app/js/*.js');
  watcher.on('change', function(event){
    console.log('file: ' + event.path + ' was changed!');
  });
});

gulp.task('uglify', function(){
  gulp.src('app/js/**/*.js')
  .pipe(ngAnnotate())
  .pipe(uglify())
  .pipe(gulp.dest('app/dist'))
});

gulp.task('default', function(){
  console.log('Gulp is running correctly!');
})