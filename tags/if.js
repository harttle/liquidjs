var Liquid = require('..');
var lexical = Liquid.lexical;

module.exports = function(liquid) {
    liquid.registerTag('if', {
        needClose: true,
        render: function(tokens, scope, token, hash) {
            var partialTokens = [],
                matching = liquid.evaluate(token.args, scope);
            for (var i = 0; i < tokens.length; i++) {
                var tk = tokens[i];
                if (tk.type === 'tag' && tk.name === 'elsif') {
                    if (matching) break;
                    matching = liquid.evaluate(tk.args, scope);
                } else if (tk.type === 'tag' && tk.name === 'else') {
                    if (matching) break;
                    else matching = true;
                } else if (matching) partialTokens.push(tk);
            }
            return liquid.renderTokens(partialTokens, scope);
        }
    });
};

