var PORT = 8080;

module.exports = function startParrotServer() {
    var server = null;

    this.registerHandler('BeforeFeatures', function BeforeFeatures(e, done) {
        var http = require('http');

        //A parrot server. Returns what you send to it.
        server = http.createServer(function requestHandler(req, res) {
            req.pipe(res);
        });
        server.listen(PORT, done);
    });

    this.registerHandler('AfterFeatures', function AfterFeatures(e, done) {
        server.close(done);
    });

    this.Given('host name and port are configured', function(done) {
        this.testConfig = this.testConfig || {};
        this.testConfig.defaultHost = 'localhost';
        this.testConfig.defaultPort = 8080;
        done();
    });
};
