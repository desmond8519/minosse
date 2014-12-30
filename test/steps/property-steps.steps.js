var path = require('path');
var assert = require('assert');
var format = require('util').format;
var moment = require('moment');
module.exports = function propertyStepsSteps() {
    this.Given('[TEST] testDataRoot path is configured', function(done) {
        this.testConfig = this.testConfig || {};
        this.testConfig.testDataRoot = path.join(__dirname, '../data');
        done();
    });

    /* eslint-disable no-eval */
    this.Given(/^\[TEST\] I assert property (.+) equals (.+)$/, function(key, value, done) {
        var actual = eval('this.' + key);
        var expected = eval('test = ' + value);
        assert.deepEqual(expected, actual);
        done();
    });

    this.Given(/^\[TEST\] I set (.+) to (.+)$/, function(key, value, done) {
        var evalString = format('this.%s = %s', key, value);
        eval(evalString);
        done();
    });

    this.Given(/^\[TEST\] I assert properties (.+) and (.+) are not the same$/,
               function(key1, key2, done) {
        var value1 = eval('this.' + key1);
        var value2 = eval('this.' + key2);
        assert.notDeepEqual(value1, value2);
        done();
    });

    this.Given(/^\[TEST\] value of (.+) is date (\S+) days? from now$/,
               function(key, days, done) {
        var actualValue = eval('this.' + key);
        var expectedValue = moment().add(parseInt(days, 10), 'days');
        var diff = moment(actualValue).diff(expectedValue, 'seconds');
        var differenceSmallEngough = (Math.abs(diff) < 1);
        assert(differenceSmallEngough, 'Dates are not the same');
        done();
    });
    /* eslint-enable */
};
