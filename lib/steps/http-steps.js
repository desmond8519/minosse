var url = require('url');
var assert = require('assert');
var request = require('request');
var objTree = require('../obj-tree');

module.exports = function httpSteps() {
    this.Before(function(done) {
        var _this = this;

        createEmptyRequest.call(this);

        //Make 'request body' a proxy for req.json.
        Object.defineProperty(this, 'request body', {
            get: function getBody() {
                return _this.req.json;
            },
            set: function setBody(body) {
                _this.req.json = body;
            }
        });

        //Make 'request headers' a proxy for req.headers.
        Object.defineProperty(this, 'request headers', {
            get: function getHeaders() {
                return _this.req.headers;
            },
            set: function setHeaders(headers) {
                _this.req.headers = headers;
            }
        });
        done();
    });

    function createEmptyRequest() {
        this.req = {
            json: {},
            headers: {}
        };
    }

    /*
     * Add arbitrary headers to the request
     */
    this.Given(/^I set the request header (\S+) with value (\S+)$/,
            function (headerName, headerValue, done) {
        this._log.info('Step: I set the request header %s with value %s', headerName, headerValue);
        this.req.headers[headerName] = headerValue;
        this['request headers'] = this.req.headers;
        done();
    });

    /**
     * Send an http request.
     */
    this.Then(/^I send a (GET|PUT|POST|DELETE|HEAD|OPTS|PATCH) request to (\S+)$/, //jshint ignore:line
            function (httpMethod, path, done) {
        this._log.info('Step: send a %s request to %s', httpMethod, path);
        var _this = this;
        var matches = path.match(/\{[^}]+\}/g) || [];
        matches.forEach(function(match) {
            var property = match.substr(1, match.length - 2);
            var value = objTree.get(this, property);
            path = path.replace(match, value);
        }, this);
        var testConfig = this.testConfig || {};
        var uri = url.parse(path);
        uri.protocol = uri.protocol || 'http:';
        uri.slashes = true;
        uri.host = uri.host || testConfig.defaultHost || 'localhost';
        uri.port = uri.port || testConfig.defaultPort || 8080;
        this.req = this.req || {};
        this.req.method = httpMethod;
        this.req.uri = uri;
        this._log.trace({ request: this.req }, 'Sending request.');
        request(this.req, function(err, res) {
            if (err) {
                _this._log.error(err, 'Sending request failed.');
                return done(err);
            }
            _this._log.trace({ response: res }, 'Received response.');
            //Reset the request.
            _this._log.trace('Deleting current request object');
            createEmptyRequest.call(_this);
            //Set the response.
            _this.res = res;
            try {
                res.body = JSON.parse(res.body);
            } catch(err) {}
            _this['response body'] = res.body;
            _this['response headers'] = res.headers;
            done();
        });
    });

    this.Then(/^the response status code is (\d+)$/,
              function(statusCode, done) {
        this._log.info('Step: the response status code is %s', statusCode);
        statusCode = parseInt(statusCode, 10);
        assert.strictEqual(statusCode, this.res.statusCode);
        done();
    });
};
