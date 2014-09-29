Feature: making http requests

    Scenario: I want to make a request
        Given host name and port are configured
        Given property foo of request body is string bar
        When send a POST request to /foo
        Then the response status code is 200
        Then check property foo of response body is string bar

    Scenario: I want to make a request to a full url
        Given host name and port are configured
        Given property foo of request body is string bar
        When send a POST request to http://localhost:8080/foo
        Then the response status code is 200
        Then check property foo of response body is string bar

    Scenario: I want to make which contains parameters.
        Given host name and port are configured
        Given property foo of bar is string localhost
        Given property foo of request body is string bar
        When send a POST request to http://{bar.foo}:8080/foo
        Then the response status code is 200
        Then check property foo of response body is string bar
