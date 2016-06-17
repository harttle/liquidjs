const _ = require('lodash');

var singleQuoted = /'[^']*'/;
var doubleQuoted = /"[^"]*"/;

var number = /-?\d+\.?\d*|\.?\d+/;
var bool = /true|false/i;
var identifier = /[a-zA-Z_$][a-zA-Z_$0-9]*/;
var subscript = /\[\d+\]/;

var quoted = new RegExp(`${singleQuoted.source}|${doubleQuoted.source}`);
var literal = new RegExp(`${quoted.source}|${bool.source}|${number.source}`, 'i');
var variable = new RegExp(`${identifier.source}(?:\\.${identifier.source}|${subscript.source})*`);
var value = new RegExp(`${literal.source}|${variable.source}`, 'i');
var range = new RegExp(`\\((?:${value.source})\\.\\.(?:${value.source})\\)`);
var rangeCapture = new RegExp(`\\((${value.source})\\.\\.(${value.source})\\)`);
var variableOrRange = new RegExp(`${variable.source}|${range.source}`);
var hash = new RegExp(`(?:${identifier.source})\\s*:\\s*(?:${value.source})`, 'g');
var hashCapture = new RegExp(`(${identifier.source})\\s*:\\s*(${value.source})`, 'g');
var filter = new RegExp(`(${identifier.source})(?:\\s*:\\s*(${value.source}))?`);
var quoteBalanced = new RegExp(`(?:${singleQuoted.source}|${doubleQuoted.source}|[^'"])*`);

var tagLine = new RegExp(`^\\s*(${identifier.source})\\s*(.*)\\s*$`);
var literalLine = new RegExp(`^(?:${literal.source})$`, 'i');
var variableLine = new RegExp(`^(?:${variable.source})$`);
var numberLine = new RegExp(`^(?:${number.source})$`);
var boolLine = new RegExp(`^(?:${bool.source})$`, 'i');
var quotedLine = new RegExp(`^(?:${quoted.source})$`);
var rangeLine = new RegExp(`^(?:${rangeCapture.source})$`);
var filterLine = new RegExp(`^(?:${filter.source})$`);

var operators = [
    /\s+or\s+/,
    /\s+and\s+/,
    /==|!=|<=|>=|<|>|\s+contains\s+/
];


function isLiteral(str) {
    return literalLine.test(str);
}

function isRange(str) {
    return rangeLine.test(str);
}

function isVariable(str) {
    return variableLine.test(str);
}

function parseLiteral(str) {
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
}

module.exports = {
    quoted, number, bool, literal, filter,
    hash, hashCapture,
    range, rangeCapture, variableOrRange,
    identifier, value, quoteBalanced, operators,
    quotedLine, numberLine, boolLine, rangeLine, literalLine, filterLine, tagLine,
    isLiteral, isVariable, parseLiteral, isRange
};
