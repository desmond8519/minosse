Feature: setting and checking properties

    Scenario Outline: Setting and checking a root property
        When property <property> is <type> <value>
        Then check property <property> is <type> <value>

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
            | foo           | string            | word          |

    Scenario Outline: Setting and checking a property
        When property <property> of <item> is <type> <value>
        Then check property <property> of <item> is <type> <value>

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
            | foo.array.[1] | bar       | string            | word          |
            | foo           | bar space | string            | word          |


    Scenario Outline: Setting and checking  null and undefined
        When property <property> of <item> is <type>
        Then check property <property> of <item> is <type>

        Examples:
            | property      | item      | type      |
            | foo           | bar       | null      |
            | foo           | bar       | undefined |

    Scenario: Setting a property to the value of another property
        Given property foo of bar is bool true
        When property foo2 of bar copies property foo of bar
        Then check property foo2 of bar is bool true

    Scenario: Loading testdata from file
        Given testDataRoot path is configured
        When testdata foo is stored as bar
        Then property nr of bar is number 42
