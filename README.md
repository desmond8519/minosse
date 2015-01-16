# cucumberjs-api-teststeps
Common steps for testing api's using [Cucumber.js](https://github.com/cucumber/cucumber-js).

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
Use the steps in your feature file:
```cucumber
Given property numbers is number-array 1,2,3
And numbers is used as request body
When I send a POST request to /sum
Then the response status code is 200
And property sum of response body is number 6
```

### What's next?
- [Check out which test steps you can use](https://github.com/icemobilelab/cucumberjs-api-teststeps/wiki/Steps)
- [Save the log output of the steps](https://github.com/icemobilelab/cucumberjs-api-teststeps/wiki/Logging)
- [Create custom steps](https://github.com/icemobilelab/cucumberjs-api-teststeps/wiki/Custom-steps)

## Development

### Style
We have an `.editorconfig` file to help us having a consistent coding style.
[Please install a plugin for your editor](http://editorconfig.org/).

We use `eslint` for code linting.
[There are plugins for that too](http://eslint.org/docs/integrations/).

### Tasks
We use gulp as a task runner. Install it globally first: `npm install -g gulp`.
To see a list of gulp commands, run:

    gulp help

### Git hooks
In the `package.json` you can see a pre-commit and pre-push hook.
On commiting or pushing these commands are executed.
If they fail, the commit/push will fail.
Add the `--no-verify` flag to your commit or push to bypass these checks.

## Swag
[![wercker status](https://app.wercker.com/status/3c834f31d67bc0b89052b3e255da2462/m "wercker status")](https://app.wercker.com/project/bykey/3c834f31d67bc0b89052b3e255da2462)
