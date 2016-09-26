const Liquid = require('..');
const lexical = Liquid.lexical;

module.exports = function(liquid) {

    liquid.registerTag('increment', {
        parse: function(token) {
            var match = token.args.match(lexical.identifier);
            if (!match) throw (new Error(`illegal identifier ${token.args}`));
            this.variable = match[0];
        },
        render: function(scope, hash) {
            var v = scope.get(this.variable);
            if (typeof v !== 'number') v = 0;
            scope.set(this.variable, v + 1);
        }
    });

};
