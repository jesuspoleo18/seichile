//Gulpfile.js

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify"),
    sourcemaps = require("gulp-sourcemaps"),
    minifyCSS = require("gulp-minify-css"),
    autoprefixer = require("gulp-autoprefixer"),
    imagemin = require('gulp-imagemin'),
    imageminMozjpeg = require('imagemin-mozjpeg'),
    cache = require('gulp-cache'),
    path = {
        srcJS: "dependencias/1.ConcatenarJS/",
        destinyJS: "dependencias/1.ConcatenarJS/result",
        srcCSS: "dependencias/2.ConcatenarCss/",
        destinyCSS: "dependencias/2.ConcatenarCss/result"
    };
// watch = require("gulp-watch"),
// copy = require("gulp-copy"),
// bower = require("gulp-bower"),

//build bundle js
gulp.task("compileJS", function () {
    // return gulp.src("dependencias/1.ConcatenarJS/*.js")
    return gulp.src([
            path.srcJS + 'foundation.min.js',
            // path.srcJS + 'slick.min.js',
            // path.srcJS + 'readmore.min.js',
            // path.srcJS + 'lightcase.js',
            path.srcJS + 'QD_infinityScroll.min.js',
            path.srcJS + 'sweetalert2.min.js',
            path.srcJS + 'what-input.js',
            path.srcJS + 'whatsapp.min.js',
            path.srcJS + 'hc-sticky.min.js',
            path.srcJS + 'advanceFilter.js',
            path.srcJS + 'md5-gravatar.js',
            path.srcJS + 'barba.min.js'
            // path.srcJS + 'curl.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat("levis-bundle-4.js"))
        .pipe(gulp.dest(path.destinyJS))
        .pipe(rename("levis-bundle-4.min.js"))
        .pipe(uglify())
        //    .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(path.destinyJS));
});

//build bundle css
gulp.task("compileCSS", function () {
    // return gulp.src("dependencias/1.ConcatenarJS/*.js")
    return gulp.src([
            // path.srcCSS + 'foundation.min.css',
            // path.srcCSS + 'slick-theme.css',
            // path.srcCSS + 'slick.css',
            // path.srcCSS + 'CoverPop.css',
            path.srcCSS + 'infinityScroll.css',
            path.srcCSS + 'sweetalert2.min.css'
        ])
        .pipe(minifyCSS())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(concat("levis-bundle-test.css"))
        .pipe(gulp.dest(path.destinyCSS))
        .pipe(rename("levis-bundle.min.css"))
        .pipe(gulp.dest(path.destinyCSS));
});

// img opti
gulp.task('optiImg', function () {
    return gulp.src('dist/assets/img/originales/cliente/categDepto/desktop/*')
        // .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(imagemin([
            imageminMozjpeg({
                quality: 80
            })
        ]))
        .pipe(gulp.dest('dist/assets/img/optimizadas/produccion/cliente/categDepto/desktop'));
});