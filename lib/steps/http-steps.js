var util = require('util');
var request = require('request');

module.exports = function httpSteps() {
    this.Given(/^(promotion|bso|set) is added to the request body$/,
               function(collection, done) {
        var item = this[collection];
        this.assert(item);
        this.req = this.req || { json: {} };
        this.req.json = item;
        done();
    });

    this.Given(/^(promotion|bso|set) no (\d+) is retrieved from the response body$/,
               function(collection, index, done) {
        var body = this.parseJson(this.res.body);
        var items = body;
        if (!util.isArray(items)) {
            items = [items];
        }
        if (index > items.length) {
            throw new Error(require('util').format('%s no %s can\'t be ' +
                    'found in response, which contains no more than %s.',
                collection,
                index,
                items.length
            ));
        }
        this[collection] = items[index-1];
        done();
    });

    this.Then(/^I send a (GET|PUT|POST|DELETE) request to (\S+)$/,
            function (httpMethod, path, done) {
        var _this = this;
        var properties = path.match(/\{([^}]+)\}/g);
        if (properties) {
            properties.forEach(function (token) {
                path = path.replace(token, _this[token.substr(1, token.length - 2)]);
            });
        }
        this.req = this.req || {};
        this.req.method = httpMethod;
        this.req.url = require('url').format({
            protocol: 'http',
            hostname: 'localhost',
            pathname: path,
            port: this.bacOptions.http.port
        });
        if (this.filePath) {
            var file = require('fs').createReadStream(this.filePath);
            var r = request[httpMethod.toLowerCase()]({
                url: _this.req.url
            }, function callback(err, response, body) {
                if (err) {
                    return done(err);
                }
                _this.req = null;
                _this.res = response;
                done();
            });
            var form = r.form();
            form.append('file', file);
        } else {
            request(this.req, function(err, res) {
                if (err) {
                    return done(err);
                }
                _this.req = null;
                _this.res = res;
                done();
            });
        }
    });

    // This method could be extended, check https://github.com/chriso/validator.js
    // for other validation types
    this.Then(/^the response property (\S+) is a valid (url|number)$/,
            function (propertyName, type, done) {
        var response = JSON.parse(this.res.body);
        var isOk = false;
        switch (type) {
            case 'url':
                isOk = this.validator.isURL(response[propertyName]);
                break;
            case 'number':
                isOk = this.validator.isNumeric(response[propertyName]);
                break;
            default:
                throw new Error(require('util').format('%s is not defined is step file',
                    type));
                break;
        }
        if (isOk) {
            done();
        } else {
            done(new Error(require('util').format('%s should be a %s',
                propertyName,
                type)));
        }
    });

    this.Then(/^the response status code is (\d+)$/,
              function(statusCode, done) {
        statusCode = parseInt(statusCode, 10);
        this.assert.strictEqual(statusCode, this.res.statusCode);
        done();
    });

    this.Then(/^the response error code is (\S+)$/, function(errorCode, done) {
        var body = this.parseJson(this.res.body);
        this.assert.equal(body.code, errorCode);
        done();

    });
};
