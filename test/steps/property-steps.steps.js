var path = require('path');
module.exports = function propertyStepsSteps() {
    this.Given('testDataRoot path is configured', function(done) {
        this.testConfig = this.testConfig || {};
        this.testConfig.testDataRoot = path.join(__dirname, '../data');
        done();
    });
};
