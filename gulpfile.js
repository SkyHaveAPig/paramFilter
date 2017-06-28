var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('dist', function(){
	gulp.src('src/*.js')
	    .pipe(concat('paramFilter.min.js'))
	    .pipe(uglify())
	    .pipe(gulp.dest('dist'));
})
