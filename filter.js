const lexical = require('./lexical.js');
const _ = require('lodash');

var _filterInstance = {
    render: function(output, scope) {
        var args = this.args.map(arg => scope.get(arg));
        args.unshift(output);
        return this.filter.apply(null, args);
    }
};

module.exports = function() {
    var filters = {};

    function construct(str) {
        var match = lexical.filterLine.exec(str.trim());
        if (!match) error('illegal filter: ' + str);

        var k = match[1], v = match[2];
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

    return {
        construct, register, clear
    };
};
