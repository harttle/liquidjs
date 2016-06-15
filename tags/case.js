var Liquid = require('..');
var patterns = Liquid.lexical.patterns;
var caseRE = new RegExp(`^\\s*case\\s+(${patterns.value.source})`);
var whenRE = new RegExp(`^\\s*when\\s+(${patterns.value.source})`);

module.exports = function(liquid) {

    liquid.registerTag('case', {
        needClose: true,
        render: function(tokens, ctx, markup, hash) {
            var match = markup.match(caseRE);
            var cond = liquid.evaluate(match[1], ctx);

            var partialTokens = [],
                matching = false;
            for (var i = 0; i < tokens.length; i++) {
                var token = tokens[i];
                if (token.type === 'tag' && token.name === 'when') {
                    if (matching) break;
                    match = token.value.match(whenRE);
                    if(!match) continue;

                    var val = liquid.evaluate(match[1], ctx);
                    if (val === cond) matching = true;
                } else if (token.type === 'tag' && token.name === 'else') {
                    if (matching) break;
                    else matching = true;
                } else if (matching) partialTokens.push(token);
            }

            return liquid.renderTokens(partialTokens, ctx);
        }
    });
};
