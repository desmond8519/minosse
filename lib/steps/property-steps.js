var path = require('path');
var assert = require('assert');
var parse = require('../parse');

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
        //Walk up the chain of properties, creating new objects / arrays as you
        //go.
        var propertyChain = property.split('.');
        propertyChain.unshift(itemName);
        var context = this;
        var lastProperty = parsePropertyName(propertyChain.shift());
        var isPropertyArray = null;
        var newContext = null;
        var nextProperty = null;
        while(propertyChain.length) {
            newContext = context[lastProperty];
            if (!newContext) {
                //Check if the next property has the [5] format, in which case
                //this property needs to become an array.
                nextProperty = parsePropertyName(propertyChain[0]);
                isPropertyArray = (typeof nextProperty === 'number');
                context[lastProperty] = newContext = isPropertyArray ? [] : {};
            }
            context = newContext;
            lastProperty = parsePropertyName(propertyChain.shift());
        }
        context[lastProperty] = value;
        done();
    });

    function parsePropertyName(propertyName) {
        var regexResult = /[(\d+)]/.exec(propertyName);
        if (regexResult) {
            return parseInt(regexResult[0], 10);
        }
        return propertyName;
    }

    /**
     * Check if a property has a certain value.
     * The property value can be a path, like `foo.bar.someValue`.
     * Array elements can be selected to: `foo.[5]`.
     */
    this.Given(/^check property (\S+) of ([\w ]+) is (\S+)(?: (.+))?$/,
               function(property, itemName, type, expected, done) {
        expected = parse(expected, type);
        assert(this[itemName]);
        var propertyChain = property.split('.');
        var actual = this[itemName];
        var lastProperty = null;
        while (propertyChain.length) {
            lastProperty = propertyChain.shift();
            //Check if this property has the [5] format, in which case we need
            //set lastProperty to 5 (the number) instead of the string '5'.
            lastProperty = parsePropertyName(lastProperty);
            actual = actual[lastProperty];
        }
        assert.deepEqual(actual, expected);
        done();
    });
};
