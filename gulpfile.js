var gulp = require('gulp');
var gutil = require('gulp-util')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css')
var imagemin = require('gulp-imagemin')
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer')

var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');

gulp.task('auto', function () {
    gulp.watch('public/**/*.js', ['js'])
    gulp.watch('public/**/*.css', ['css'])
    gulp.watch('public/**/*.png', ['img'])
})

var handleError = function (err) {
    var colors = gutil.colors;
    console.log('\n')
    gutil.log(colors.red('Error!'))
    gutil.log('fileName: ' + colors.red(err.fileName))
    gutil.log('lineNumber: ' + colors.red(err.lineNumber))
    gutil.log('message: ' + err.message)
    gutil.log('plugin: ' + colors.yellow(err.plugin))
}

gulp.task('default', ['css', 'js','img']);

gulp.task('js', function () {
    return gulp.src('public/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build/'))
});
gulp.task('css', function () {
    return gulp.src('public/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
              browsers: 'last 2 versions'
            }))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build/'))
});
gulp.task('img', function () {
    return gulp.src('public/**/*.png')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('build/'))
});