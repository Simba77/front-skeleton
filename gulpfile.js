'use strict';

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    csso = require('gulp-csso'),
    //del = require('del'),
    imagemin = require('gulp-imagemin'),
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
    gulp.watch('./src/scss/*.scss', gulp.series('sass'));
    gulp.watch('./src/js/**/*.js', gulp.series('js'));
    gulp.watch('./dist/*.html').on('change', reload);
});



// SCSS compiled
gulp.task('sass', function () {
    return gulp.src('./src/scss/*.scss')
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
        './node_modules/font-awesome/css/font-awesome.css'
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
        './node_modules/jquery/dist/jquery.min.js',
        './node_modules/popper.js/dist/umd/popper.js',
        './node_modules/bootstrap/dist/js/bootstrap.min.js'
    ])
        // Собственно компиляция
        .pipe(concat('vendor.min.js'))
        // Минификация
        .pipe(uglify())
        // Путь компиляции
        .pipe(gulp.dest('./dist/js'));
});

// Сжатие изображений
gulp.task('img', function () {
    return gulp.src('./src/images/*')
        .pipe(imagemin())
        // Куда класть
        .pipe(gulp.dest('./dist/images'));
});


// Шрифты
gulp.task('fontsVendor', function () {
    return gulp.src([
        './node_modules/font-awesome/fonts/**/*.*'
    ])
    .pipe(gulp.dest('./dist/fonts'));
});


gulp.task('build', gulp.parallel('sass', 'js', 'cssVendor', 'jsVendor', 'fontsVendor', 'img'));


// Стандартная задача для разработки
gulp.task('default', gulp.series('build', 'serve'));