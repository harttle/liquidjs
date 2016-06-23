const lexical = require('./lexical.js');
const _ = require('lodash');
const Exp = require('./expression.js');

var valueRE = new RegExp(`${lexical.value.source}`, 'g');

module.exports = function() {
    var filters = {};

    var _filterInstance = {
        render: function(output, scope) {
            var args = this.args.map(arg => Exp.evalValue(arg, scope));
            args.unshift(output);
            return this.filter.apply(null, args);
        },
        parse: function(str) {
            var match = lexical.filterLine.exec(str);
            if (!match) throw new Error('illegal filter: ' + str);

            var name = match[1], argList = match[2] || '', filter = filters[name];
            if (typeof filter !== 'function'){
                throw new Error(`filter "${name}" not found`);
            }

            var args = [];
            while(match = valueRE.exec(argList.trim())){
                args.push(match[0]);
            }

            this.name = name;
            this.filter = filter;
            this.args = args;

            return this;
        }
    };

    function construct(str) {
        var instance = Object.create(_filterInstance);
        instance.parse(str);
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
