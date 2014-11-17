# cucumberjs-api-teststeps
Common test steps for testing api's.
This modules steps are split into three categories:

## Usage

### Property steps
For setting and checking properties on objects.

<hr>
##### `property foo of bar is string bla`
Set `bar.foo` to `bla`.
Check below for different types that are supported.
Examples of this call:

    property foo.subfoo of bar is number 4
    property fooArray[3] of bar is null

<hr>
##### `check property foo of bar is string bla`
Assert that `bar.foo` equals `bla`.
Supports the same interface as the setting rule above.

<hr>
##### `check property foo of bar has type string`
Assert that `typeof bar.foo` equals `string`.
Supports the same interface as the rules above.

<hr>
##### `I remove property foo of bar`
Removes the property `bar.foo`

<hr>
##### **DEPRECATED** `testdata foo is stored as bar`
Loads data from a `testdata.json` file and stores it on the property `bar`.
`testdata.json` is looked up in `testConfig.testDataRoot` of it is defined,
or the current working directory otherwise.

Instead of using this step, you can use an ordinary get:

    property bar is testdata foo

<hr>
##### **DEPRECATED** `I set property foo of bar with a unique id`
Sets the property `bar.foo` with a unique id

Instead of using this step, you can use an ordinary set:

    property foo of bar is uuid()

<hr>
##### **DEPRECATED** `property foo of bar copies property test of ice`
Set `bar.foo` to the value of `ice.test`.

Instead of using this step, you can now use the ordinary get and set methods:

    property foo of bar is property apple of fruit

### Http steps
For making http requests.
You can use the property steps to set the `request body` property, check the
`response body` property or setting the `request headers`.

<hr>
##### `foo is used as request body`
Sets the property `Foo` as the request body.

<hr>
##### `foo is used as request headers`
Sets the property `Foo` as the request headers.

<hr>
##### `response body is stored as foo`
Sets `foo` to the response body.

<hr>
##### `I send a POST request to /foo`
Make a request to an endpoint.
If only a path is provided, host and port are retrieved from
`testConfig.defaultHost` and `testConfig.defaultPort` respectively, or, if those
are not set, `localhost` and `8080`.
It is also possible to provide a full path (don't forget the protocol):

    send a POST request to http://foo.com/bar

<hr>
##### `the reponse status code is 200`
Check the status code of the response.

<hr>
##### `I set the request header tenant with value foomart`
Set `tenant` request header to `foomart`.

### Debug steps
For debugging features.

<hr>
##### `DEBUG I print property foo`
Prints the selected property to the console between the test results.

<hr>
##### `DEBUG I eval console.log(this.testConfig);`
Evaluate any javascript expression with the world object as value for `this`.

You can perform assertions to build quick placeholder test-steps.
For instance, the following step will fail if `this.foo` does not equal `bar`.

    DEBUG I eval assert(this.foo === 'bar')

### Types
Commands that set or check properties take a property in the format `property <type> <value>`.
The type determines how the value is parsed.
Some types do not require a value.

##### `string <value>`

##### `int <value>`

##### `float <value>` (alias: number)

##### `boolean <value>` (alias: bool)

##### `undefined`

##### `null`

##### `object <value>`
Parses the value string as JSON.

##### `date <value>`
Parses `value` into a javascript date object.
You can provide any value that is succesfully parsd by the `Date` constructor or the special values
`now`, `<number> days ago` or `<number> days from now`.

##### `dateISOString <value>`
Parses `value` into an ISO8601 string.
Takes the same values as the `date` type.

##### `property <value>`
Copies the value of another property.
You can provide any valid property selector, like `foo of bar` or `bar.foo[4]`.

##### `testdata <value>`
Loads data from a `<value>.json` file and stores it on the property `bar`.
`testdata.json` is looked up in `testConfig.testDataRoot` of it is defined,
or the current working directory otherwise.

##### `uuid()`
Generates a uuid and and uses that as value.
Beware: you cannot use this type to check if a value is a uuid.

#### Array types
If you want to parse an array of values, you can use array types `string-array`, `int-array`, etc.
Seperate the array elements by comma's.

    Given property numbers is int-array 1,2,3,4

### Usage in custom steps
To help you with writing custom teststeps that play well with this libraries steps, some
functionalities are exposed.

#### Add custom types
You can add support for your own custom types by writing a parser.
Consider the example that adds a type for binary numbers.

```js
function myTestSteps() {
    this.World.prototype.parsers['binary-number'] = function parseReverseString(valueString) {
        return parseInt(valueString, 2);
    }
}
```

#### Get and set properties
If your custom step needs to get or set a property, use `getProperty` and `setProperty`.
An example that multiplies a property by two could look like this:

```js
this.Given(/^property (.+) is multiplied by two$/, function(propertyString, done) {
    var value = this.getProperty(propertyString);
    this.setProperty(propertyString, 2*value);
    done();
});
```

### Logging
The test steps can product log output for debugging.
To use this functionality, make sure your custom test steps are loaded after the api teststeps, then
add this to your test-step function:

```js
function myTestSteps() {
    this.createLogger({ /* bunyan configuration here */ });
}
```

Check out [bunyan](https://github.com/trentm/node-bunyan) to see what you can configure.

### Development

#### Style
We have an `.editorconfig` file to help us having a consistent coding style.
[Please install a plugin for your editor](http://editorconfig.org/).

We use `jshint` for code linting.
[There are plugins for that too](http://www.jshint.com/install/).

#### Tasks
We use gulp as a task runner. Install it globally first: `npm install -g gulp`.
To see a list of gulp commands, run:

    gulp help

#### Git hooks
In the `package.json` you can see a pre-commit and pre-push hook.
On commiting or pushing these commands are executed.
If they fail, the commit/push will fail.
Add the `--no-verify` flag to your commit or push to bypass these checks.
