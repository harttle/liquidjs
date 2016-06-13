const _ = require('lodash');

var singleQuoted = /^'[^']*'$/;
var doubleQuoted = /^"[^"]*"$/;

var number = /^(?:\d+\.?\d*|\.?\d+)$/;
var bool = /^(?:true|false)$/i;
var range = /^\((\d+)\.\.(\d+)\)$/;

var quoted = new RegExp(`${singleQuoted.source}|${doubleQuoted.source}`);
var literal = new RegExp(`${quoted.source}|${range.source}|${bool.source}|${number.source}`, 'i');
var variable = /^[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*|\[\d+\])*$/;
var identifier = new RegExp(`${literal.source}|${variable.source}`, 'i');

exports.patterns = {
    quoted, number, bool, range, literal
};

exports.isLiteral = function(str) {
    return literal.test(str);
};

exports.isVariable = function(str) {
    return variable.test(str);
};

exports.parseLiteral = function(str) {
    var res;
    if(res = str.match(number)){
        return Number(str);
    }
    if(res = str.match(bool)){
        return str.toLowerCase() === 'true';
    }
    if(res = str.match(quoted)){
        return str.slice(1, -1);
    }
    if(res = str.match(range)){
        return _.range(res[1], res[2]);
    }
};
