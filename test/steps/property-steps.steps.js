var path = require('path');
var assert = require('assert');
var format = require('util').format;
module.exports = function propertyStepsSteps() {
    this.Given('[TEST] testDataRoot path is configured', function(done) {
        this.testConfig = this.testConfig || {};
        this.testConfig.testDataRoot = path.join(__dirname, '../data');
        done();
    });

    this.Given(/^\[TEST\] I assert property (.+) equals (.+)$/, function(key, value, done) {
        var actual = eval('this.' + key); //jshint ignore:line
        var expected = eval('test = ' + value); //jshint ignore:line
        assert.deepEqual(expected, actual);
        done();
    });

    this.Given(/^\[TEST\] I set (.+) to (.+)$/, function(key, value, done) {
        var evalString = format('this.%s = %s', key, value);
        eval(evalString); //jshint ignore:line
        done();
    });

    this.Given(/^\[TEST\] I assert properties (.+) and (.+) are not the same$/,
               function(key1, key2, done) {
        var value1 = eval('this.' + key1); //jshint ignore:line
        var value2 = eval('this.' + key2); //jshint ignore:line
        assert.notDeepEqual(value1, value2);
        done();
    });
};
