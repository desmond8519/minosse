var moment = require('moment');

var typeMap = {
    'string': parseString,
    'int': parseInt,
    'float': parseFloat,
    'boolean': JSON.parse,
    'object': parseObject,
    'date': parseDate,
    'dateISOString': parseDateISOString,
    'undefined': function () { return undefined; },
    'null': function () { return null; },
    'property': parseProperty,
    'uuid()': require('node-uuid').v4
};

//Add aliases
typeMap.number = typeMap.float;
typeMap.bool = typeMap.boolean;

module.exports = typeMap;

function parseString(valuestring) {
    return valuestring || '';
}

function parseObject(valueString) {
    try {
        return JSON.parse(valueString);
    }
    catch (err) {
        throw new Error('Invalid JSON: ' + valueString);
    }
}

function parseDate(valueString) {
    var date = null;
    var dateRegex = /\d+ days? (from now|ago)/;
    if (valueString === 'now') {
        date = moment();
    } else if (dateRegex.test(valueString)){
        var regexResult = dateRegex.exec(valueString);
        var amountOfDays = parseInt(regexResult[1], 10);
        var addOrSub = (regexResult[2] === 'ago') ? 'subtract' : 'add';
        date = moment()[addOrSub](amountOfDays, 'days');
    } else {
        date = moment(new Date(valueString));
    }

    //Return the date or dateString.
    return date.toDate();
}

function parseDateISOString(valueString) {
    var isValidDatestring = moment(valueString, moment.ISO_8601).isValid();
    if (isValidDatestring) {
        return valueString;
    }
    var date = parseDate(valueString);
    var dateISOString = date.toISOString();
    return dateISOString;
}

function parseProperty(propertyString) {
    var value = this.getProperty(propertyString);
    return value;
}
