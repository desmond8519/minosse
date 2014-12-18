# cucumberjs-api-teststeps
Common test steps for testing api's.
This modules steps are split into three categories:

## Usage
Install the library:
```
npm install cucumberjs-api-teststeps --save-dev
```
Create a steps file in your project and load the api teststeps from there and add an optional configuration:
```js
module.exports = function myCustomSteps() {
    require('cucumerjs-api-teststeps').call(this);
    this.testConfig = {
        defaultHost: 'localhost',
        defaultPort: 8080
    };
}
```
Use the steps in your feature file
```cucumber
Given property numbers is number-array 1,2,3
When I send a POST request to /sum
Then the response status code is 200
And property sum of response body is number 6
```

### What's next?
## Contents
- [Check out which test steps you can use](wiki/Steps)
- [Save the log output of the steps](wiki/Logging)
- [Create custom steps](wiki/Custom-steps)

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
