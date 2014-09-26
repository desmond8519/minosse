var util = require('util');

module.exports = function apiSteps() {
    function print(content) {
        var prettyContent = util.inspect(content, { colors: true });
        console.log(prettyContent);
    }

    this.Then(/^DEBUG I print (?:the )?([\w ]+)$/, function(itemName, done) {
        print(this[itemName]);
        done();
    });

    this.Then(/^DEBUG I eval (.+)$/, function(evalString, done) {
        eval.call(this, evalString); //jshint ignore:line
        done();
    });
};
