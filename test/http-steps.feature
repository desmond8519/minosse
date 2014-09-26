Feature: making http requests

    @only
    Scenario: I want to make a request
        Given host name and port are configured
        Given property foo of request body is string bar
        Then DEBUG I print req
        # Then DEBUG I eval console.log(this['request-body']);
        When send a POST request to /foo
        # Then check property foo of response body is string bar
