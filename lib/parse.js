var moment = require('moment');
function parse(valueString, type) {
    switch(type) {
        case 'string':
            return valueString;
        case 'int':
            return parseInt(valueString, 10);
        case 'number':
        case 'float':
            return parseFloat(valueString);
        case 'bool':
        case 'boolean':
            return JSON.parse(valueString);
        case 'object':
            try {
                return JSON.parse(valueString);
            }
            catch (err) {
                throw new Error('Invalid JSON: ' + valueString);
            }
            break;
        case 'list':
        case 'array':
            return valueString.split(',');
        case 'date':
        case 'dateISOString':
            var returnISOString = (type === 'dateISOString');
            var date = null;
            var dateRegex = /\d+ days? (from now|ago)/;
            var isValidDatestring = moment(valueString, moment.ISO_8601)
                                        .isValid();
            if (returnISOString && isValidDatestring) {
                return valueString;
            } else if (valueString === 'now') {
                date = this.moment();
            } else if (dateRegex.test(valueString)){
                var regexResult = dateRegex.exec(valueString);
                var amountOfDays = parseInt(regexResult[1], 10);
                var addOrSub = (regexResult[2] === 'ago') ? 'subtract' : 'add';
                date = this.moment()[addOrSub](amountOfDays, 'days');
            } else {
                date = moment(new Date(valueString));
            }

            //Return the date or dateString.
            if (returnISOString) {
                return date.format();
            } else {
                return date.toDate();
            }
            break;
        case 'undefined':
            return void(0);
        case 'null':
            return null;

        default:
            throw new Error('Setting property of unknown type: ' + type);
    }
}

module.exports = parse;
