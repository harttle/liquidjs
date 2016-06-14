const _ = require('lodash');

var singleQuoted = /'[^']*'/;
var doubleQuoted = /"[^"]*"/;

var number = /\d+\.?\d*|\.?\d+/;
var bool = /true|false/i;
var range = /\((\d+)\.\.(\d+)\)/;
var identifier = /[a-zA-Z_$][a-zA-Z_$0-9]*/;
var subscript = /\[\d+\]/;

var quoted = new RegExp(`${singleQuoted.source}|${doubleQuoted.source}`);
var literal = new RegExp(`${quoted.source}|${range.source}|${bool.source}|${number.source}`, 'i');
var variable = new RegExp(`${identifier.source}(?:\\.${identifier.source}|${subscript.source})*`);
var value = new RegExp(`${literal.source}|${variable.source}`, 'i');
var hash = new RegExp(`(${identifier.source})\\s*:\\s*(${value.source})`, 'g');
var filter = new RegExp(`(${identifier.source})(?:\\s*:\\s*(${value.source}))?`);

var literalLine = new RegExp(`^(?:${literal.source})$`, 'i');
var variableLine = new RegExp(`^(?:${variable.source})$`);
var numberLine = new RegExp(`^(?:${number.source})$`);
var boolLine = new RegExp(`^(?:${bool.source})$`, 'i');
var quotedLine = new RegExp(`^(?:${quoted.source})$`);
var rangeLine = new RegExp(`^(?:${range.source})$`);
var filterLine = new RegExp(`^(?:${filter.source})$`);

exports.patterns = {
    quoted, number, bool, range, literal, hash, filter, identifier,
    quotedLine, numberLine, boolLine, rangeLine, literalLine, filterLine
};

exports.isLiteral = function(str) {
    return literalLine.test(str);
};

exports.isVariable = function(str) {
    return variableLine.test(str);
};

exports.parseLiteral = function(str) {
    var res;
    if (res = str.match(numberLine)) {
        return Number(str);
    }
    if (res = str.match(boolLine)) {
        return str.toLowerCase() === 'true';
    }
    if (res = str.match(quotedLine)) {
        return str.slice(1, -1);
    }
    if (res = str.match(rangeLine)) {
        return _.range(res[1], res[2]);
    }
};
