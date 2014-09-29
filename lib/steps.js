module.exports = function apiTestSteps() {
    //This file is loaded by cucumber.js. Load submodules in turn.
    require('./steps/debug-steps').call(this);
    require('./steps/http-steps').call(this);
    require('./steps/property-steps').call(this);
};
