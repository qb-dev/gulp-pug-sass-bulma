var gulp          = require('gulp');
var clean         = require('gulp-clean');
var pug           = require('gulp-pug');
var sass          = require('gulp-sass');
var browserSync   = require('browser-sync').create();
var autoprefixer  = require('gulp-autoprefixer');
var exec          = require('child_process').exec;

var root  = './';
var dir   = 'public'; // you may change this.
var paths = {
  pug:  ['./*.pug', '!**[^_]/*.pug'],
  sass: 'assets/css/*.sass',
  //sass: 'assets/css/**/*.sass',
  js:   'assets/scripts/**/*.js'
}

// - ###########################################################################
// - Runs the 'clean' task first before it run all other tasks.
// - ###########################################################################
gulp.task('default', ['clean'], function(cb) {
    exec('gulp main', function(err,stdout,stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});
gulp.task('main', ['pug', 'sass', 'js', 'serve']);

// - ###########################################################################
// - Compile PUG files to HTML
// - ###########################################################################
gulp.task('pug', function() {
    /*
     * Compile all pug files except files with
     * file names that starts with an underscore('_').
     */
    return gulp.src(paths.pug)
      .pipe(pug({
          doctype: 'html',
          pretty: true
      }))
      .pipe(gulp.dest(root + dir));
});
gulp.task('pug-watch', ['pug'], function (done) {
    browserSync.reload();
    done();
});

// - ###########################################################################
// - Compile JS files
// - ###########################################################################
gulp.task('js', function() {
    return gulp.src(paths.js)
      .pipe(gulp.dest(root + dir + '/assets/scripts'))
      .pipe(browserSync.stream());;
});

// - ###########################################################################
// - Compile SASS files to CSS
// - ###########################################################################
gulp.task('sass', function() {
    return gulp.src(paths.sass)
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(gulp.dest(root + dir + '/assets/css'))
      .pipe(browserSync.stream());
});
gulp.task('sass-watch', ['sass'], function (done) {
    browserSync.reload();
    done();
});

// - ###########################################################################
// - Copy assets (css, images, scripts, etc...)
// - ###########################################################################
var assetsBaseDir = "./assets";
var assets = [
    assetsBaseDir + '/css/**/*.css',
    assetsBaseDir + '/images/**/*.*'
];
gulp.task('copy', function() {
    gulp.src(assets, { base: './'})
        .pipe(gulp.dest(root + dir));
});


// - ###########################################################################
// - Clean task (deletes the public folder)
// - ###########################################################################
gulp.task('clean', function() {
    return gulp.src(root + dir, { read: false })
        .pipe(clean({force: true}));
});

// - ###########################################################################
// - Serve app and watch
// - ###########################################################################
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: root + dir
    }
  });
  gulp.watch(paths.scss, ['sass']);
  gulp.watch(paths.js, ['js']);
  gulp.watch('./**/*.sass',['sass-watch']);
  gulp.watch("public/assets/css*.css").on('change', browserSync.reload);
  gulp.watch('./**/*.pug',['pug-watch']);
  gulp.watch("public/*.html").on('change', browserSync.reload);
});