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

    /**
     * Choose an object to use as response body.
     */
    this.Given(/^([\w ]+) is used as request body$/, function(itemName, done) {
        var item = this[itemName];
        assert(item);
        setRequestBody.call(this, item);
        done();
    });

    /**
     * Store the response body on an object.
     */
    this.Given(/^response body is stored as ([\w ]+)$/,
               function(itemName, done) {
        var res = this.res || {};
        var resJSON = res.body;
        var resBody = null;
        try {
            resBody = JSON.parse(resJSON);
        } catch(err) {
            throw new Error('Invalid response body.');
        }
        this[itemName] = resBody;
        done();
    });

    /**
     * Send an http request.
     */
    this.Then(/^send a (GET|PUT|POST|DELETE|HEAD|OPTS|PATCH) request to (\S+)$/,
            function (httpMethod, path, done) {
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
        request(this.req, function(err, res) {
            if (err) {
                return done(err);
            }
            //Reset the request.
            _this.req = null;
            setRequestBody.call(this);
            //Set the response.
            _this.res = res;
            _this['response body'] = res.body;
            done();
        });
    });

    this.Then(/^the response status code is (\d+)$/,
              function(statusCode, done) {
        statusCode = parseInt(statusCode, 10);
        assert.strictEqual(statusCode, this.res.statusCode);
        done();
    });
};
