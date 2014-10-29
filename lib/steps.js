var bunyan = require('bunyan');

module.exports = function apiTestSteps() {
    this.Before(function(done) {
        //Create a no-op logger that can be overwritten by tests to get
        //test-step output.
        this._log = this._log || bunyan.createLogger({
            name: 'test-steps',
            streams: []
        });
        done();
    });

    //This file is loaded by cucumber.js. Load submodules in turn.
    require('./steps/debug-steps').call(this);
    require('./steps/http-steps').call(this);
    require('./steps/property-steps').call(this);
};
