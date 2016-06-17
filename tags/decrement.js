const Liquid = require('..');
const lexical = Liquid.lexical;
const error = Liquid.error;

module.exports = function(liquid) {

    liquid.registerTag('decrement', {
        parse: function(token) {
            var match = token.args.match(lexical.identifier);
            if (!match) error(`illegal identifier ${token.args}`, token);
            this.variable = match[0];
        },
        render: function(scope, hash) {
            var v = scope.get(this.variable);
            if (typeof v !== 'number') v = 0;
            scope.set(this.variable, v - 1);
        }
    });

};
