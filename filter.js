const lexical = require('./lexical.js');
const _ = require('lodash');

var filters = {};

var _filterInstance = {
    render: function(output, ctx) {
        var args = this.args.map(arg => ctx.get(arg));
        args.unshift(output);
        return this.filter.apply(null, args);
    }
}

function parse(str) {
    var match = lexical.patterns.filterLine.exec(str.trim());
    if (!match) {
        throw new Error('illegal filter: ' + str);
    }
    var k = match[1],
        v = match[2];

    return factory(k, [v]);
}

function factory(name, args) {
    var filter = filters[name];
    if (typeof filter !== 'function') 
        throw new Error(`filter ${name} not found`);

    var instance = Object.create(_filterInstance);
    instance.args = args;
    instance.filter = filter;
    return instance;
}

function register(name, filter) {
    filters[name] = filter;
}

function clear() {
    filters = {};
}

exports.parse = parse;
exports.register = register;
exports.clear = clear;
