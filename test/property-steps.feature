Feature: setting and checking properties

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
            | foo           | bar       | array             | one,two,three |
            | foo           | bar       | list              | one,two,three |
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

    Scenario: Loading testdata from file
        Given testDataRoot path is configured
        When testdata foo is stored as bar
        Then property nr of bar is number 42
