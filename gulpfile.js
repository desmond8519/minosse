var exec = require('child_process').exec;
var gulp = require('gulp');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');

require('gulp-help')(gulp);
require('jshint-stylish');

gulp.task('test', 'Run all tests.', function(cb) {
    runSequence('lint',
                'test-cucumber',
                cb);
});

gulp.task('test-cucumber', 'Run cucumber integration tests.', function(cb) {
    exec(
        './node_modules/cucumber/bin/cucumber.js test/*.feature ' +
        '-r lib/steps.js -r test/steps/ -f pretty',
        function(err, stdout, stderr) {
            if (err) {
                console.log(stdout);
                return cb(err);
            }
            console.log(stdout);
            console.log(stderr);
        });
});

gulp.task('lint', 'Lint all js files.', function() {
    return gulp.src(['./**/*.js', '!./node_modules/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});
