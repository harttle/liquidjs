var Liquid = require('..');
var lexical = Liquid.lexical;
var re = new RegExp(`(${lexical.identifier.source})`);

module.exports = function(liquid) {

    liquid.registerTag('capture', {
        needClose: true,
        render: function(tokens, scope, token, hash) {
            var html = liquid.renderTokens(tokens, scope);
            var match = token.args.match(re);
            if (!match) throw new Error(`${token.args} not valid identifier`);

            scope.set(match[1], html);
        }
    });

};
