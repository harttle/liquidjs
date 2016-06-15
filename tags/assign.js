var Liquid = require('..');
var lexical = Liquid.lexical;
var re = new RegExp(`(${lexical.identifier.source})\\s*=(.*)`);

module.exports = function(liquid) {

    liquid.registerTag('assign', {
        render: function(tokens, scope, token, hash) {
            var match = token.value.match(re);
            var k = match[1], v = match[2];
            scope.set(k, liquid.evaluate(v, scope));
        }
    });

};
