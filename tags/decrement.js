const Liquid = require('..');
const lexical = Liquid.lexical;
const assert = require('../src/util/assert.js');

module.exports = function(liquid) {

    liquid.registerTag('decrement', {
        parse: function(token) {
            var match = token.args.match(lexical.identifier);
            assert(match, `illegal identifier ${token.args}`);
            this.variable = match[0];
        },
        render: function(scope, hash) {
            var v = scope.get(this.variable);
            if (typeof v !== 'number') v = 0;
            scope.set(this.variable, v - 1);
        }
    });

};
