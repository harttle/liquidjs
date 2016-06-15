const Liquid = require('..');
const lexical = Liquid.lexical;
const error = Liquid.error;

module.exports = function(liquid) {

    liquid.registerTag('decrement', {
        render: function(tokens, scope, token, hash) {
            var match = token.args.match(lexical.identifier);
            if(!match) error(`illegal identifier ${token.args}`, token);
            var k = match[0], v = scope.get(k);
            if(typeof v !== 'number') v = 0;
            scope.set(k, v-1);
        }
    });

};
