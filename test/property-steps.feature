Feature: setting and checking properties

    Scenario Outline: Setting and checking a root property
        When I set property <property> to <type> <value>
        Then I check property <property> equals <type> <value>

        Examples:
            | property      | type              | value         |
            | foo           | string            | word          |
            | foo           | number            | 4.3           |
            | foo           | float             | 4.3           |
            | foo           | int               | 4             |
            | foo           | boolean           | true          |
            | foo           | bool              | true          |
            | foo           | object            | { "nr": 42 }  |
            | foo           | string-array      | one,two,three |
            | foo           | number-array      | 1,2,3         |
            | foo           | date              | 01/11/1989    |
            | foo           | dateISOString     | 01/11/1989    |
            | foo.chain     | string            | word          |
            | foo.array.[1] | string            | word          |
            | foo.array[1]  | string            | word          |
            | foo           | string            | word          |

    Scenario Outline: Setting and checking a property
        When I set property <property> of <item> to <type> <value>
        Then I check property <property> of <item> equals <type> <value>

        Examples:
            | property      | item      | type              | value         |
            | foo           | bar       | string            | word          |
            | foo           | bar       | number            | 4.3           |
            | foo           | bar       | float             | 4.3           |
            | foo           | bar       | int               | 4             |
            | foo           | bar       | boolean           | true          |
            | foo           | bar       | bool              | true          |
            | foo           | bar       | object            | { "nr": 42 }  |
            | foo           | bar       | string-array      | one,two,three |
            | foo           | bar       | number-array      | 1,2,3         |
            | foo           | bar       | date              | 01/11/1989    |
            | foo           | bar       | dateISOString     | 01/11/1989    |
            | foo.chain     | bar       | string            | word          |
            | foo.array[1]  | bar       | string            | word          |
            | foo           | bar space | string            | word          |

    Scenario: Comparing if two attributes are equal
        When I set property apple to number 42
        And I set property foo of bar to property apple
        Then I check property foo of bar equals property apple

    Scenario: Comparing if two attributes are equal
        When I set property apple of fruit to number 42
        And I set property foo of bar to property apple of fruit
        Then I check property foo of bar equals property apple of fruit

    Scenario Outline: Setting and checking null and undefined
        When I set property <property> of <item> to <type>
        Then I check property <property> of <item> equals <type>

        Examples:
            | property      | item      | type      |
            | foo           | bar       | null      |
            | foo           | bar       | undefined |

    Scenario: Loading testdata from file
        Given testDataRoot path is configured
        When I set property foo to testdata foo
        Then I check property nr of foo equals number 42

    Scenario: Checking the type of a property.
        Given I set property foo to string bar
        Then I check property foo has type string

    Scenario: Setting a property to a uuid
        When I set property foo to uuid()
        Then I check property foo has type string
