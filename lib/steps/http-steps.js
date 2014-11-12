var url = require('url');
var assert = require('assert');
var request = require('request');
var objTree = require('../obj-tree');

module.exports = function httpSteps() {
    this.Before(function(done) {
        setRequestBody.call(this);
        done();
    });

    function setRequestBody(body) {
        body = body || {};
        this.req = this.req || {};
        this.req.json = body;
        this['request body'] = body;
    }

    function setRequestHeaders(headers) {
        headers = headers || {};
        this.req = this.req || {};
        this.req.headers = headers;
        this['request headers'] = headers;
    }

    /**
     * Choose an object to use as response body.
     */
    this.Given(/^([\w ]+) is used as request body$/, function(itemName, done) {
        this._log.info('Step: %s is used as request body', itemName);
        var item = this[itemName];
        assert(item);
        setRequestBody.call(this, item);
        done();
    });

    /**
     * Choose an object to use as response body.
     */
    this.Given(/^([\w ]+) is used as request headers$/,
        function(itemName, done) {
            this._log.info('Step: %s is used as request headers', itemName);
            var item = this[itemName];
            assert(item);
            setRequestHeaders.call(this, item);
            done();
    });

    /**
     * Store the response body on an object.
     */
    this.Given(/^response body is stored as ([\w ]+)$/,
               function(itemName, done) {
        this._log.info('Step: response body is stored as %s', itemName);
        var res = this.res || {};
        var resBody = res.body;
        this._log.trace({ responseBody: resBody },
                        'Storing the response body.');
        this[itemName] = resBody;
        done();
    });

    /**
     * Add basic HTTP authentication to the request.
     */
    this.Given(/^I want to use HTTP authentication with username (\S+) and password (\S+)$/, //jshint ignore:line
            function (username, password, done) {
        this._log.info('Step: I want to use HTTP authentication with ' +
                       'username %s and password %s', username, password);
        this.req = this.req || {};
        this.req.auth = {
            user: username,
            pass: password
        };
        done();
    });

    /*
     * Add arbitrary headers to the request
     */
    this.Given(/^I set the request header (\S+) with value (\S+)$/,
            function (headerName, headerValue, done) {
        this._log.info('Step: I set the request header %s with value %s',
                       headerName, headerValue);
        this.req = this.req || {};
        this.req.headers = this.req.headers || {};
        if (headerValue === 'EMPTY') {
            delete this.req.headers[headerName];
        }
        else {
            this.req.headers[headerName] = headerValue;
        }
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
            _this.req = null;
            setRequestBody.call(_this);
            //Set the response.
            _this.res = res;
            try {
                res.body = JSON.parse(res.body);
                this._log.trace('Body parsed as JSON.');
            } catch(err) {}
            _this['response body'] = res.body;
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
