var assert = require('assert');
var objTree = require('../obj-tree');

function pathFromPropertyString(propertyString) {
    var propertyRegex = /^(\S+)(?: of ([\w ]+))?$/;
    var matches = propertyRegex.exec(propertyString);
    if (!matches) {
        return propertyString;
    }
    var path = matches[1];
    var rootProperty = matches[2];
    if (rootProperty) {
        path = [rootProperty, path].join('.');
    }
    //Turn foo[5] into foo.[5]. Do not touch foo.[5].
    path = path.replace(/\.?\[/g, '.[');
    return path;
}

module.exports = function propertySteps() {
    this.World.prototype.getProperty = function getProperty(propertyString) {
        var path = pathFromPropertyString(propertyString);
        this._log.debug({ path: path }, 'Getting property.');
        var value = objTree.get(this, path);
        return value;
    };

    this.World.prototype.setProperty = function setProperty(propertyString, value) {
        var path = pathFromPropertyString(propertyString);
        this._log.debug({ path: path, value: value }, 'Setting property.');
        objTree.set(this, path, value);
    };

    this.World.prototype.parseValueString = function parseValueString(typeValueString) {
        var valueRegex = /^(\S+) ?(.+)?$/;
        var matches = valueRegex.exec(typeValueString);
        var type = matches[1];
        var valueString = matches[2];
        var value = this.parse(type, valueString);
        return value;
    };

    this.World.prototype.parsers = require('../parsers');
    this.World.prototype.parse = function parse(type, valueString) {
        //We're parsing an array. Find out what type of array.
        if (/-array$/.test(type)) {
            var subType = type.split('-')[0];
            return valueString.split(',').map(parse.bind(this, subType));
        }

        var parser = this.parsers[type];
        if (!parser) {
            throw new Error('Setting property of unknown type: ' + type);
        }

        var value = parser.call(this, valueString);
        return value;
    };

    /**
     * Set a property to a certain value.
     */
    this.Given(/^I set (?:property|the) (.+) to (.+)$/,
               function(propertyString, valueString, done) {
        this._log.info('Step: I set property %s to %s', propertyString, valueString);
        var value = this.parseValueString(valueString);
        this.setProperty(propertyString, value);
        done();
    });

    /**
     * Check if a property has a certain value.
     */
    this.Given(/^I check (?:property|the) (.+) equals (.+)$/,
               function(propertyString, valueString, done) {
        this._log.info('Step: I check property %s equals %s', propertyString, valueString);
        var expected = this.parseValueString(valueString);
        var actual = this.getProperty(propertyString);
        this._log.trace({ expected: expected, actual: actual }, 'Comparing values.');
        assert.deepEqual(actual, expected);
        done();
    });

    /**
     * Check if a property has not a certain value.
     */

    this.Given(/^I check (?:property|the) (.+) does not equals (.+)$/,
        function(propertyString, valueString, done) {
            this._log.info('Step: I check property %s does not equal %s', propertyString, valueString);
            var expected = this.parseValueString(valueString);
            var actual = this.getProperty(propertyString);
            this._log.trace({ expected: expected, actual: actual }, 'Comparing values.');
            assert.notEqual(actual, expected);
            done();
        });

    /**
     * Check if a property has a certain type.
     */
    this.Given(/^I check (?:property|the) (.+) has type (\S+)$/,
               function(propertyString, expected, done) {
        this._log.info('Step: I check property %s has type %s', propertyString, expected);
        var actual = typeof this.getProperty(propertyString);
        this._log.trace({ expected: expected, actual: actual }, 'Comparing types.');
        assert.deepEqual(actual, expected);
        done();
    });

    /**
     * Remove a property.
     */
    this.Given(/^I remove (?:property|the) (.+)$/, function(propertyString, done) {
        this._log.info('Step: I remove property %s', propertyString);
        var path = pathFromPropertyString(propertyString);
        this._log.debug({ path: path }, 'Removing property.');
        objTree.remove(this, path);
        done();
    });
};
