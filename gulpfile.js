var exec = require('child_process').exec;
var gulp = require('gulp');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var minimist = require('minimist');
var _ = require('lodash');

var argv = minimist(process.argv.slice(2));

require('gulp-help')(gulp);
require('jshint-stylish');

gulp.task('test', 'Run all tests.', function(cb) {
    runSequence('lint',
                'test-cucumber',
                cb);
});

gulp.task('test-cucumber', 'Run cucumber integration tests.', function(cb) {
    //Get the tags we need to run.
    var tags = argv.t || argv.tags || [];
    if (!_.isArray(tags)) {
        tags = [tags];
    }
    var tagArgs = tags.map(function(tag) {
        return '-t ' + tag;
    }).join(' ');

    exec(
        './node_modules/cucumber/bin/cucumber.js test/*.feature ' +
        '-r lib/steps.js -r test/steps/ -f pretty ' +
        tagArgs,
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
