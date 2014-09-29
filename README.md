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

## Http steps
For making http requests.
You can use the property steps to set the `request body` property or check the
`response body` property.

<hr>
##### `foo is used as request body`
Sets the property `Foo` as the request body.

<hr>
##### `response body is stored as foo`
Sets `foo` to the response body.

<hr>
##### `send a POST request to /foo`
Make a request to an endpoint.
If only a path is provided, host and port are retrieved from
`testConfig.defaultHost` and `testConfig.defaultPort` respectively, or, if those
are not set, `localhost` and `8080`.
It is also possible to provide a full path (don't forget the protocol):

    send a POST request to http://foo.com/bar

<hr>
##### `the reponse status code is 200`
Check the status code of the response.

## Debug steps
For debugging features.

<hr>
##### `DEBUG I print foo`
Prints the selected property to the console between the test results.
You can also add `the`:

    DEBUG I print the request body

<hr>
##### `DEBUG I eval console.log(this.testConfig);`
Evaluate any javascript expression with the world object as value for `this`.
