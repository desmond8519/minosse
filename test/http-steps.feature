Feature: making http requests

    Scenario: I want to make a request
        Given I set property foo of request body to string bar
        When I send a POST request to /foo
        Then the response status code is 200
        Then I check property foo of response body equals string bar

    Scenario: I want to make a to a host and port defined in the testConfig
        Given host name and port are configured
        Given I set property foo of request body to string bar
        When I send a POST request to /foo
        Then the response status code is 200
        Then I check property foo of response body equals string bar

    Scenario: I want to make a request to a full url
        Given I set property foo of request body to string bar
        When I send a POST request to http://localhost:8080/foo
        Then the response status code is 200
        Then I check property foo of response body equals string bar

    Scenario: I want to make which contains parameters
        Given I set property foo of bar to string localhost
        Given I set property foo of request body to string bar
        When I send a POST request to http://{bar.foo}:8080/foo
        Then the response status code is 200
        Then I check property foo of response body equals string bar

    Scenario: I want to prepare an object as request body
        Given I set property foo of myObject to string bar
        And myObject is used as request body
        When I send a POST request to /foo
        Then the response status code is 200
        Then I check property foo of response body equals string bar
