# cucumberjs-api-teststeps
Common test steps for testing api's.
This modules steps are split into three categories:

## Property steps
For setting and checking properties on objects.

<hr>
##### `testdata foo is stored as bar`
Loads data from a `testdata.json` file and stores it on the property `bar`.
`testdata.json` is looked up in `testConfig.testDataRoot` of it is defined,
or the current working directory otherwise.

<hr>
##### `property foo of bar is string bla`
Set `bar.foo` to `bla`.
Examples of this call:

    property foo.subfoo of bar is number 4
    property fooArray.[3] of bar is null

<hr>
##### `check property foo of bar is string bla`
Assert that `bar.foo` equals `bla`.
Supports the same interface as the setting rule above.

<hr>
##### `check property foo of bar has type string`
Assert that `typeof bar.foo` equals `string`.
Supports the same interface as the rules above.

<hr>
##### `I set property foo of bar with a unique id`
Sets the property `bar.foo` with a unique id

<hr>
##### `I remove property foo of bar`
Removes the property `bar.foo`

<hr>
##### **DEPRECATED** `property foo of bar copies property test of ice`
Set `bar.foo` to the value of `ice.test`.

Instead of using this step, you can now use the ordinary get and set methods:

    property foo of bar is property apple of fruit

## Http steps
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

## Debug steps
For debugging features.

<hr>
##### `DEBUG I print foo`
Prints the selected property to the console between the test results.
You can also add `the`:

    DEBUG I print the request body
    DEBUG I print the request headers
    DEBUG I print the response body

<hr>
##### `DEBUG I eval console.log(this.testConfig);`
Evaluate any javascript expression with the world object as value for `this`.

## Development

### Style
We have an `.editorconfig` file to help us having a consistent coding style.
[Please install a plugin for your editor](http://editorconfig.org/).

We use `jshint` for code linting.
[There are plugins for that too](http://www.jshint.com/install/).

### Tasks
We use gulp as a task runner. Install it globally first: `npm install -g gulp`.
To see a list of gulp commands, run:

    gulp help

### Git hooks
In the `package.json` you can see a pre-commit and pre-push hook.
On commiting or pushing these commands are executed.
If they fail, the commit/push will fail.
Add the `--no-verify` flag to your commit or push to bypass these checks.
