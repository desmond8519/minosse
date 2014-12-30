var PORT = 8080;

module.exports = function startParrotServer() {
    var server = null;

    this.registerHandler('BeforeFeatures', function BeforeFeatures(e, done) {
        var http = require('http');

        //A parrot server. Returns what you send to it.
        server = http.createServer(function requestHandler(req, res) {
            copySelectedHeaders(req, res);
            req.pipe(res);
        });
        server.listen(PORT, done);
    });

    function copySelectedHeaders(req, res) {
        var headers = req.headers;
        var headerNames = Object.keys(headers);
        headerNames
            .filter(function isTestHeader(headerName) {
                return /^test-/.test(headerName);
            })
            .forEach(function addHeaderToRest(headerName) {
                var headerValue = headers[headerName];
                res.setHeader(headerName, headerValue);
            });
    }

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
