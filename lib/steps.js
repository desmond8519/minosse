var bunyan = require('bunyan');

module.exports = function apiTestSteps() {
    this.World = function World(done) {
        this._context = {};
        done();
    };

    this.createLogger = function createLogger(options) {
        this.World.prototype._log = bunyan.createLogger(options);
    };

    this.createLogger({
        name: 'test-steps',
        streams: []
    });

    this.Before(function(scenario, done) {
        this._log.info('Scenario: %s', scenario.getName());
        done();
    });

    //This file is loaded by cucumber.js. Load submodules in turn.
    require('./steps/debug-steps').call(this);
    require('./steps/http-steps').call(this);
    require('./steps/property-steps').call(this);
};
