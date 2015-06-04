var gulp = require('gulp'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    batch = require('gulp-batch'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    csscomb = require('gulp-csscomb'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint');



// ---------------CSS TASKS--------------------------------------------------------------------------
gulp.task('cssconcatinate', function() {
  gulp.src('public/**/*.css')
    .pipe(concat('all.css'))
    .pipe(gulp.dest('build/css'));
    
    setTimeout(function(){
        return gulp.run('csscombination');
    }, 500);
});

gulp.task('csscombination', function () {
  gulp.src('build/css/all.css')
    .pipe(csscomb())
    .pipe(gulp.dest('build/css'));

    setTimeout(function(){
        return gulp.run('cssminification');
    }, 500);
});

gulp.task('cssminification', function () {
    gulp.src('build/css/all.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/css'));
});

gulp.task('csstask', function(){
    gulp.run('cssconcatinate');
});



// ---------------JS TASKS---------------------------------------------------------------------------
gulp.task('hint', function() {
  return gulp.src('public/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('concatinate', function() {
    gulp.src('public/js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('build/js'));
    
    setTimeout(function(){
        return gulp.run('compress');
    }, 500);
});

gulp.task('compress', function() {
  return gulp.src('build/js/all.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/js'));
});

gulp.task('jstask', function(){
    gulp.run('hint', 'concatinate');
});



// ---------------GULP WATCH---------------------------------------------------------------------------
gulp.task('stream', function () {
    watch('public/**/*.js', batch(function (events, done) {
        gulp.start('jstask', done);        
    }));

    watch('public/**/*.css', batch(function (events, done) {
        gulp.start('csstask', done);
    }));

    gulp.src('build/**/*.**')
         .pipe(watch('build/**/*.**'))
         .pipe(connect.reload());

    gulp.src('build/*.**')
         .pipe(watch('build/*.**'))
         .pipe(connect.reload());
});


// -------------------SERVER-LIVERELOAD-----------------------------------------------
gulp.task('connect', function(){
    connect.server({
        root: 'build',
        livereload: true
    });    
});


// ---------------DEFAULT---------------------------------------------------------------------------
gulp.task('default', ['jstask', 'csstask', 'stream', 'connect']);


