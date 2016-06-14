var Liquid = require('..');
var patterns = Liquid.lexical.patterns;
var re = new RegExp(`(${patterns.identifier.source})\\s*=(.*)`);

module.exports = function(liquid) {

    liquid.registerTag('assign', {
        render: function(tokens, ctx, markup, hash) {
            var match = markup.match(re);
            var k = match[1], v = match[2];
            ctx.set(k, liquid.evaluate(v, ctx));
        }
    });

};
