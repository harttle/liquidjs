var Liquid = require('..');
var lexical = Liquid.lexical;
var Promise = require('any-promise');
var re = new RegExp(`(${lexical.identifier.source})\\s*=(.*)`);

module.exports = function(liquid) {

    liquid.registerTag('assign', {
        parse: function(token){
            var match = token.args.match(re);
            if(!match) throw new Error(`illegal token ${token.raw}`);
            this.key = match[1];
            this.value = match[2];
        },
        render: function(scope) {
            scope.set(this.key, liquid.evalOutput(this.value, scope));
            return Promise.resolve('');
        }
    });

};
