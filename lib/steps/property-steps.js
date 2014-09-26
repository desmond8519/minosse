var path = require('path');
var assert = require('assert');
var parse = require('../parse');
var objTree = require('../obj-tree');

module.exports = function propertySteps() {

    /**
     * Load an object from a `.json` file and save it on the world.
     * Test data is looked up in the current working directory by default,
     * unless an alternative is provided on `this.testConfig.testDataRoot`.
     */
    this.Given(/^testdata (\w+) is stored as ([\w ]+)$/,
               function(fileName, itemName, done) {
        var testDataRoot = this.testConfig.testDataRoot || process.cwd();
        var filePath = path.join(testDataRoot, fileName + '.json');
        //Don't use `require` because that caches the returned object.
        var json = require('fs').readFileSync(filePath, { encoding: 'utf8'});
        var item = JSON.parse(json);
        assert(item);
        this[itemName] = item;
        done();
    });

    /**
     * Set a property to a certain value.
     * The property value can be a path, like `foo.bar.someValue`.
     * Array elements can be selected to: `foo.[5]`.
     */
    this.Given(/^property (\S+) of ([\w ]+) is (\S+)(?: (.+))?$/,
               function(property, itemName, type, valueString, done) {
        var value = parse(valueString, type);
        var path = itemName + '.' + property;
        objTree.set(this, path, value);
        done();
    });

    /**
     * Check if a property has a certain value.
     * The property value can be a path, like `foo.bar.someValue`.
     * Array elements can be selected to: `foo.[5]`.
     */
    this.Given(/^check property (\S+) of ([\w ]+) is (\S+)(?: (.+))?$/,
               function(property, itemName, type, expected, done) {
        expected = parse(expected, type);
        assert(this[itemName]);
        var root = this[itemName];
        var actual = objTree.get(root, property);
        assert.deepEqual(actual, expected);
        done();
    });
};
