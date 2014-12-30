var fs = require('fs');
var path = require('path');
var COVERAGE_PATH = path.join(__dirname, '../../coverage');

module.exports = function extractCoverageVariable() {
    //After tests have run, export the istanbul coverage to a file.
    this.registerHandler('AfterFeatures', function AfterFeatures(e, done) {
        var COVERAGE_RESULT = JSON.stringify(global.ISTANBUL_COVERAGE);
        if (!fs.existsSync(COVERAGE_PATH)){
            fs.mkdirSync(COVERAGE_PATH);
        }
        fs.writeFileSync(path.join(COVERAGE_PATH, 'istanbul-coverage.json'), COVERAGE_RESULT);
        done();
    });
};
