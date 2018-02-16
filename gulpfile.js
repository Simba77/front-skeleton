'use strict';

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    csso = require('gulp-csso'),
    //del = require('del'),
    //imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    //pngquant = require('imagemin-pngquant'),
    uglify = require('gulp-uglify'),
    gulp_sass = require('gulp-sass');

var browsersync = require('browser-sync').create(),
    reload = browsersync.reload;


gulp.task('serve', function () {
    browsersync.init({
        server: './dist'
    });
    gulp.watch('./dist/*.html');
    gulp.watch('./src/sass/*.scss', gulp.series('sass'));
    gulp.watch('./src/js/**/*.js', gulp.series('js'));
    gulp.watch('./dist/*.html').on('change', reload);
});



// SCSS compiled
gulp.task('sass', function () {
    return gulp.src('./src/sass/*.scss')
        .pipe(plumber())
        // Для генераии style.css.map
        .pipe(sourcemaps.init())
        // Собственно компиляция
        .pipe(gulp_sass({outputStyle: 'expanded'}).on('error', gulp_sass.logError))
        // Автопрефиксер
        .pipe(autoprefixer())
        // Ренэймер
        .pipe(rename({suffix: '.min'}))
        // Минификация
        .pipe(csso())
        // Куда положить .map
        .pipe(sourcemaps.write('./'))
        // Путь компиляции
        .pipe(gulp.dest('./dist/css'))
        .pipe(browsersync.stream());
});



// js compiled
gulp.task('js', function () {
    return gulp.src('./src/js/**/*.js')
        .pipe(plumber())
        // Для генераии style.css.map
        .pipe(sourcemaps.init())
        // Собственно компиляция
        .pipe(concat('scripts.min.js'))
        // Минификация
        .pipe(uglify())
        // Куда положить .map
        .pipe(sourcemaps.write('./'))
        // Путь компиляции
        .pipe(gulp.dest('./dist/js'))
        .pipe(browsersync.stream());
});


// Сборка вендорных css
gulp.task('cssVendor', function () {
    return gulp.src([
        './src/vendor/normalize.css/normalize.css',
        './src/vendor/bootstrap/dist/css/bootstrap.min.css',
        './src/vendor/font-awesome/web-fonts-with-css/css/fontawesome-all.min.css'
    ])
        // Объединяем
        .pipe(concat('vendor.min.css'))
        // Сжимаем
        .pipe(csso())
        // Куда сохранять
        .pipe(gulp.dest('./dist/css'))
        .pipe(browsersync.stream());
});


// js vendor compiled
gulp.task('jsVendor', function () {
    return gulp.src([
        './src/vendor/jquery/dist/jquery.min.js',
        './src/vendor/bootstrap/dist/js/bootstrap.min.js'
    ])
        // Собственно компиляция
        .pipe(concat('vendor.min.js'))
        // Минификация
        .pipe(uglify())
        // Путь компиляции
        .pipe(gulp.dest('./dist/js'));
});


// Шрифты
gulp.task('fontsVendor', function () {
    return gulp.src([
        './src/vendor/font-awesome/web-fonts-with-css/webfonts/**/*.*'
    ])
    .pipe(gulp.dest('./dist/fonts'));
});


gulp.task('build', gulp.parallel('sass', 'js', 'cssVendor', 'jsVendor', 'fontsVendor'));


// Стандартная задача для разработки
gulp.task('default', gulp.series('build', 'serve'));