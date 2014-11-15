var path = require('path');
var assert = require('assert');
var parse = require('../parse');
var uuid = require('node-uuid').v4;
var objTree = require('../obj-tree');

function pathFromPropertyString(propertyString) {
    var propertyRegex = /^(\S+)(?: of ([\w ]+))?$/;
    var matches = propertyRegex.exec(propertyString);
    var path = matches[1];
    var rootProperty = matches[2];
    if (rootProperty) {
        path = [rootProperty, path].join('.');
    }
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

    /**
     * Load an object from a `.json` file and save it on the world.
     * Test data is looked up in the current working directory by default,
     * unless an alternative is provided on `this.testConfig.testDataRoot`.
     */
    this.Given(/^testdata (\S+) is stored as ([\w ]+)$/,
               function(fileName, itemName, done) {
        this._log.info('Step: testdata %s is stored as %s', fileName, itemName);
        var testDataRoot = this.testConfig.testDataRoot || process.cwd();
        var filePath = path.join(testDataRoot, fileName + '.json');
        //Don't use `require` because that caches the returned object.
        this._log.trace({ path: filePath }, 'Loading file.');
        var json = require('fs').readFileSync(filePath, { encoding: 'utf8'});
        var item = null;
        try {
            item = JSON.parse(json);
        }
        catch(err) {
            this._log.error({ fileContents: json }, 'File contained invalid JSON.');
            done(err);
        }
        this._log.trace({ loadedData: item }, 'File loaded.');
        assert(item);
        this[itemName] = item;
        done();
    });

    /**
     * Set a property to a certain value.
     * The property value can be a path, like `foo.bar.someValue`.
     * Array elements can be selected to: `foo.[5]`.
     */
    this.Given(/^property (.+) is (\S+) ?(.+)?$/,
               function(propertyString, type, valueString, done) {
        this._log.info('Step: property %s is %s %s', propertyString, type, valueString);
        var value = parse.call(this, valueString, type);
        this.setProperty(propertyString, value);
        done();
    });

    /**
     * Check if a property has a certain value.
     * The property value can be a path, like `foo.bar.someValue`.
     * Array elements can be selected to: `foo.[5]`.
     */
    this.Given(/^check property (.+) is (\S+) ?(.+)?$/,
               function(propertyString, type, expected, done) {
        this._log.info('Step: check property %s is %s %s', propertyString, type, expected);
        expected = parse.call(this, expected, type);
        var actual = this.getProperty(propertyString);
        this._log.trace({ expected: expected, actual: actual }, 'Comparing values.');
        assert.deepEqual(actual, expected);
        done();
    });

    /**
     * Check if a property has a certain type.
     * The property value can be a path, like `foo.bar.someValue`.
     * Array elements can be selected to: `foo.[5]`.
     */
    this.Given(/^check property (.+) has type (\S+)$/,
               function(propertyString, expected, done) {
        this._log.info('Step: check property %s has type %s', propertyString, expected);
        var actual = typeof this.getProperty(propertyString);
        this._log.trace({ expected: expected, actual: actual }, 'Comparing types.');
        assert.deepEqual(actual, expected);
        done();
    });

    /**
     * Assign the value of one property to another property.
     */
    this.Given(/^property (.+) copies property (.+)$/,
               function(toPropertyString, fromPropertyString, done) {
        this._log.info('Step: property %s copies property %s', toPropertyString,
                       fromPropertyString);
        var value = this.getProperty(fromPropertyString);
        this.setProperty(toPropertyString, value);
        done();
    });

    /**
     * Set a property with a random unique id
     */
    this.Given(/^I set property (.+) with a unique id$/, function (propertyString, itemName, done) {
        this._log.info('Step: I set property %s with a unique id', propertyString);
        var value = uuid();
        this.setProperty(propertyString, value);
        done();
    });

    /**
     * Remove a property.
     */
    this.Given(/^I remove property (.+)$/, function (propertyString, done) {
        this._log.info('Step: I remove property %s', propertyString);
        var path = pathFromPropertyString(propertyString);
        this._log.debug({ path: path }, 'Removing property.');
        objTree.remove(this, path);
        done();
    });
};
