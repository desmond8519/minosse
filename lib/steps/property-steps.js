var path = require('path');
var assert = require('assert');
var parse = require('../parse');
var uuid = require('node-uuid').v4;
var objTree = require('../obj-tree');

module.exports = function propertySteps() {

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
            this._log.error({ fileContents: json },
                            'File contained invalid JSON.');
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
    this.Given(/^property (\S+)(?: of ([\w ]+))? is (\S+)(?: (.+))?$/,
               function(property, itemName, type, valueString, done) {
        this._log.info('Step: property %s of %s is %s %s', property, itemName,
                       type, valueString);
        var value = parse(valueString, type);
        if (itemName) {
            property = itemName + '.' + property;
        }
        this._log.trace({ key: property, value: value }, 'Setting property.');
        objTree.set(this, property, value);
        done();
    });

    /**
     * Check if a property has a certain value.
     * The property value can be a path, like `foo.bar.someValue`.
     * Array elements can be selected to: `foo.[5]`.
     */
    this.Given(/^check property (\S+)(?: of ([\w ]+))? is (\S+)(?: (.+))?$/,
               function(property, itemName, type, expected, done) {
        this._log.info('Step: check property %s of %s is %s %s', property,
                       itemName, type, expected);
        expected = parse(expected, type);
        if (itemName) {
            property = itemName + '.' + property;
        }
        var actual = objTree.get(this, property);
        this._log.trace({ key: property, expected: expected, actual: actual},
                        'Comparing actual and expected values.');
        assert.deepEqual(actual, expected);
        done();
    });

    /**
     * Assign the value of one property to another property.
     */
    this.Given(/^property (\S+)(?: of ([\w ]+))? copies property (\S+)(?: of ([\w ]+))?$/,//jshint ignore:line
              function(toProperty, toItemName, fromProperty, fromItemName,
                       done) {
        this._log.info('Step: property %s of %s copies property %s of %s',
                       toProperty, toItemName, fromProperty, fromItemName);
        if (toItemName) {
            toProperty = toItemName + '.' + toProperty;
        }
        if (fromItemName) {
            fromProperty = fromItemName + '.' + fromProperty;
        }
        var value = objTree.get(this, fromProperty);
        objTree.set(this, toProperty, value);
        this._log.trace({ key: toProperty, value: value }, 'Setting property.');
        done();
    });

    /**
     * Set a property with a random unique id
     */
    this.Given(/^I set property (\S+)(?: of ([\w ]+))? with a unique id$/,
                function (property, itemName, done) {
        this._log.info('Step: I set property %s of %s with a unique id',
                    property, itemName);
        if (itemName) {
            property = itemName + '.' + property;
        }
        var value = uuid();
        this._log.trace({ key: property, value: value }, 'Setting property.');
        objTree.set(this, property, value);
        done();
    });
};
