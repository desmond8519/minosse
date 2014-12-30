Feature: setting and checking properties
    # We are testing cucumber steps here.
    # Steps prefixed with [TEST] are not under test themselves, but support the tests of others.

    Scenario Outline: Setting a property
        When I set property <property> to <type> <value>
        Then [TEST] I assert property <property> equals <result>

        Examples:
            | property     | type          | value         | result                     |
            | foo          | string        | word          | 'word'                     |
            | foo          | number        | 4.3           | 4.3                        |
            | foo          | float         | 4.3           | 4.3                        |
            | foo          | int           | 4             | 4                          |
            | foo          | boolean       | true          | true                       |
            | foo          | bool          | true          | true                       |
            | foo          | object        | { "nr": 42 }  | { 'nr': 42 }               |
            | foo          | string-array  | one,two,three | ['one', 'two', 'three']    |
            | foo          | number-array  | 1,2,3         | [1, 2, 3]                  |
            | foo          | dateISOString | 11/01/1989    | '1989-10-31T23:00:00.000Z' |
            | foo.chain    | string        | word          | 'word'                     |
            | foo.array[1] | string        | word          | 'word'                     |

    Scenario: Setting a property of a subproperty
        When I set property foo of bar to number 42
        Then [TEST] I assert property bar.foo equals 42

    Scenario Outline: Setting a property to null and undefined
        When I set property <property> to <value>
        Then [TEST] I assert property <property> equals <value>

        Examples:
            | property | value     |
            | foo      | null      |
            | foo      | undefined |

    Scenario Outline: Checking a property
        When [TEST] I set <property> to <actual value>
        Then I check property <property> equals <expected type> <expected value>

        Examples:
            | property     | actual value               | expected type | expected value |
            | foo          | 'word'                     | string        | word           |
            | foo          | 4.3                        | number        | 4.3            |
            | foo          | 4.3                        | float         | 4.3            |
            | foo          | 4                          | int           | 4              |
            | foo          | true                       | boolean       | true           |
            | foo          | true                       | bool          | true           |
            | foo          | { 'nr': 42 }               | object        | { "nr": 42 }   |
            | foo          | ['one', 'two', 'three']    | string-array  | one,two,three  |
            | foo          | [1, 2, 3]                  | number-array  | 1,2,3          |
            | foo          | '1989-10-31T23:00:00.000Z' | dateISOString | 11/01/1989     |

    Scenario: Checking a nested property
        When [TEST] I set foo to { list: [1, 2, 3] }
        Then I check property foo.list[1] equals number 2

    Scenario Outline: Checking a property equals null or undefined
        When [TEST] I set <property> to <value>
        Then I check property <property> equals <value>

        Examples:
            | property | value     |
            | foo      | null      |
            | foo      | undefined |

    Scenario: Setting a property to the value of another property
        Given [TEST] I set bar to 42
        When I set property foo to property bar
        Then [TEST] I assert property foo equals 42

    Scenario: Comparing if two attributes are equal
        When [TEST] I set bar to 42
        And [TEST] I set foo to 42
        Then I check property foo equals property bar

    Scenario: Loading testdata from file
        Given [TEST] testDataRoot path is configured
        When I set property foo to testdata foo
        Then [TEST] I assert property foo.nr equals 42

    Scenario: Checking the type of a property.
        When [TEST] I set foo to 'bar'
        Then I check property foo has type string

    Scenario: Setting a property to a uuid
        When I set property foo to uuid()
        And I set property bar to uuid()
        Then [TEST] I assert properties foo and bar are not the same

    Scenario: Setting a date to now
        When I set property foo to date now
        Then [TEST] value of foo is date 0 days from now

    Scenario: Setting a relative date in the future
        When I set property foo to date 3 days from now
        Then [TEST] value of foo is date 3 days from now

    Scenario: Setting a relative date in the past
        When I set property foo to date 3 days ago
        Then [TEST] value of foo is date -3 days from now

    Scenario: Setting a date using an ISO string
        When I set property foo to dateISOString 1989-10-31T23:00:00.000Z
        Then [TEST] I assert property foo equals '1989-10-31T23:00:00.000Z'

    Scenario: Removing a property
        Given [TEST] I set foo to 42
        When I remove property foo
        Then [TEST] I assert property foo equals undefined
