'use strict';
var install = require("gulp-install");
var gulp = require('gulp');
var plugins = require('gulp-load-plugins');
var rigger = require('gulp-rigger');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var del = require('del');
var browserify = require('browserify');
var autoprefixer = require('autoprefixer');
var browsersync = require('browser-sync');
var server = require('browser-sync').create();
var svgSprite = require('gulp-svg-sprite');
var reload = server.reload;


var path = {
  build: {
    html:'build/',
    htmlIndex:'build/index.html',
    js: 'build/js',
    // jsMin: 'build/js/js-minifyed/',
    css: 'build/css/',
    // cssMin: 'build/css/final-minifyed/',
    img: 'build/img/'
  },
  dev: {
    // === within pug
    // html: ['_pug/2_page/*.pug'],
    // indexhtml: ['_pug/2_page/index.pug'],
    // htmlall: ['_pug/**/**/**/**/*.pug'],
    // htmlfin: ['../*.html'],

    // ==== without pug
    html: ['src/*.html','src/**/*.html'],
    htmlIndex:['src/index.html'],
    // htmlToMin: ['build/*.html'],
    // ===

    js: ['src/js/*.js'],
    // jsToMin: ['build/js/*.js'],
    img: ['src/img/*'],
    scss: ['src/scss/main.scss'],
    cssfin:  ['build/css/*.css'],
    scssall: ['src/scss/**/**/*.scss']
    // json: ['static.json']
  }
};

// ===============
// intall bower(front) dependencies
// ===============

gulp.task('bower', function() {
    return gulp.src(['bower.json'])
        .pipe(install());
});

// ===============
// build html
// ===============

gulp.task('buildhtml', function () {
  // var MY_LOCALS = {};
  return gulp.src(path.dev.html)
  .pipe(rigger())
  // .pipe(pug({locals: MY_LOCALS}))
  .pipe(gulp.dest(path.build.html))
  .pipe(reload({stream: true}));
});

gulp.task('buildindexhtml', function () {
  // var MY_LOCALS = {};
  return gulp.src(path.dev.htmlIndex)
  .pipe(rigger())
  // .pipe(pug({locals: MY_LOCALS}))
  .pipe(gulp.dest(pathout.html))
  .pipe(reload({stream: true}));
});

gulp.task('minhtml', function () {
  return gulp.src(path.dev.htmlToMin)
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(rename({suffix: '-min'}))
  .pipe(gulp.dest(path.build.html));
});

// ===============
// build css
// ===============

gulp.task('buildcss', function () {

  return gulp.src(path.dev.scss)
  .pipe(rigger())
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([autoprefixer({browsers: ['last 2 version']})]))
  .pipe(gulp.dest(path.build.css))
  .pipe(reload({stream: true}));
});

gulp.task('mincss', function () {
  return gulp.src(path.dev.cssfin)
  .pipe(sourcemaps.init())
  .pipe(cleanCSS())
  .pipe(sourcemaps.write())
  .pipe(rename({suffix: '-min'}))
  .pipe(gulp.dest(path.build.cssMin));
});

// ===============
// minify img
// ===============

gulp.task('imgmin', function () {
  var imagemin = require('gulp-imagemin');
  var png = require('imagemin-pngquant');
  var jpeg = require('imagemin-jpegtran');
  var svg = require('imagemin-svgo');

  return gulp.src(path.dev.img)
  .pipe(imagemin({
    progressive: true,
    use: [jpeg(), png(), svg()]
  }))
  .pipe(gulp.dest(path.build.img))
  .pipe(reload({stream: true}));
});

// ===============
// build js
// ===============

gulp.task('buildjs', function () {
  return gulp.src(path.dev.js)
  .pipe(concat('main.js'))
  .pipe(gulp.dest(path.build.js))
});

gulp.task('minjs', function () {
  return gulp.src(path.dev.jsToMin)
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(path.build.jsMin))
  .pipe(reload({stream: true}));
});

// ===============
// Inject
// ===============

gulp.task('inject',['default'], function () {
  // var js = gulp.src(path.dev.jsToMin);
  // var css = gulp.src(path.dev.cssfin);
  // var jsbundle = gulp.src('build/js/libs/bundle.js');
  var sources = gulp.src(['build/js/libs/*.js','build/js/*.js','build/css/*.css','build/css/**/*.css'], {read:false});
  return gulp.src(path.build.htmlIndex)
  // .pipe(inject( css, { relative:true } ))
  // .pipe(inject( js, { relative:true } ))
  // .pipe(inject( jsbundle, { relative:true } ))
  .pipe(inject( sources, { relative:true } ))
  .pipe(gulp.dest('build/'))
  .pipe(reload({stream: true}));
});

// ===============
// Sync
// ===============

gulp.task('browsersync', function () {
  server.init({
    server: {
      baseDir: './build/'
    },
    port: 8081,
    open: true,
    notify: false
  });
});

// ===============
// Clean
// ===============

gulp.task('clean', function () {
  del(['build/']);
});

// ===============
// Copy ExternalLibs and Static JSON
// ===============

gulp.task('copyJSON',function() {
  return gulp.src(path.dev.json)
  .pipe(gulp.dest('build/'));
});

gulp.task('copyExternalCss', function () {
  return gulp.src('bower_components/bootstrap/dist/css/bootstrap.min.css')
  .pipe(gulp.dest('build/css/libs'))
});

gulp.task('copyFonts', function () {
  return gulp.src('src/fonts/arimo.ttf')
  .pipe(gulp.dest('build/fonts'))
});

gulp.task('copyExternalJs', function () {
  return gulp.src('src/js/libs/*.js')
  // .pipe(concat('bundle.js'))
  .pipe(gulp.dest('build/js/libs'))
});


// ===============
// Build svgSprite
// ===============

gulp.task('svgSprite', function () {
    return gulp.src('src/img/*.svg')
        .pipe(svgSprite({
                mode: {
                    stack: {
                        sprite: "../sprite.svg"
                    }
                },
            }
        ))
        .pipe(gulp.dest('build/img/sprite/'));
});

// ===============
// Watch
// ===============

gulp.task('watch', function () {
  gulp.watch(path.dev.html, ['buildhtml','inject']);
  gulp.watch(path.dev.scssall, ['buildcss']);
  gulp.watch(path.dev.js, ['buildjs']);
});


gulp.task('serve', ['inject','watch','browsersync']);

gulp.task('copyExternalComponents', ['copyExternalJs','copyFonts']);
gulp.task('default', ['buildhtml','buildcss', 'buildjs','copyExternalComponents']);
gulp.task('minify', ['minhtml', 'minjs', 'mincss', 'browsersync']);
gulp.task('build', ['buildhtml', 'buildjs', 'buildcss', 'minhtml', 'minjs', 'mincss', 'browsersync']);
