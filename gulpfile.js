var gulp = require('gulp'),
    gulpWatch = require('gulp-watch'),
    del = require('del'),
    runSequence = require('run-sequence'),
    argv = process.argv;

var isRelease = argv.indexOf('--release') > -1;

/**
 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */
gulp.task('serve:before', ['watch']);
gulp.task('emulate:before', ['build']);
gulp.task('deploy:before', ['build']);
gulp.task('build:before', ['build']);

// we want to 'watch' when livereloading
var shouldWatch = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1;
gulp.task('run:before', [shouldWatch ? 'watch' : 'build']);

/**
 * Ionic Gulp tasks, for more information on each see
 * https://github.com/driftyco/ionic-gulp-tasks
 *
 * Using these will allow you to stay up to date if the default Ionic 2 build
 * changes, but you are of course welcome (and encouraged) to customize your
 * build however you see fit.
 */
var buildBrowserify = require('./browserify-typescript.js');
var buildSass = require('ionic-gulp-sass-build');
var copyHTML = require('ionic-gulp-html-copy');
var copyFonts = require('ionic-gulp-fonts-copy');
var copyScripts = require('ionic-gulp-scripts-copy');

gulp.task('copy:zocial', function() {
    return gulp.src('node_modules/css-social-buttons/css/**/*')
        .pipe(gulp.dest('www/build/css'));
});

gulp.task('watch', ['clean'], function(done) {
    runSequence(
        ['sass', 'html', 'fonts', 'scripts', 'copy:zocial'],
        function() {
            gulpWatch('app/**/*.scss', function() {
                gulp.start('sass');
            });
            gulpWatch('app/**/*.html', function() {
                gulp.start('html');
            });
            buildBrowserify({
                watch: true,
                minify: isRelease,
                tsifyOptions: {
                    typescript: require('typescript')
                },
                browserifyOptions: {
                    debug: !isRelease
                },
                uglifyOptions: {
                    mangle: false
                }
            }).on('end', done);
        }
    );
});

gulp.task('build', ['clean'], function(done) {
    runSequence(
        ['sass', 'html', 'fonts', 'scripts', 'copy:zocial'],
        function() {
            buildBrowserify({
                minify: isRelease,
                browserifyOptions: {
                    debug: !isRelease
                },
                uglifyOptions: {
                    mangle: false
                }
            }).on('end', done);
        }
    );
});

gulp.task('sass', buildSass);
gulp.task('html', copyHTML);
gulp.task('fonts', copyFonts);
gulp.task('scripts', copyScripts);

gulp.task('clean', function() {
    return del('www/build');
});
