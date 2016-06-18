var Liquid = require('..');
var lexical = Liquid.lexical;
var re = new RegExp(`(${lexical.identifier.source})\\s*=(.*)`);

module.exports = function(liquid) {

    liquid.registerTag('assign', {
        parse: function(token){
            var match = token.args.match(re);
            if(!match) error(`illegal token ${token.raw}`, token);
            this.key = match[1];
            this.value = match[2];
        },
        render: function(scope, hash) {
            scope.set(this.key, liquid.evalOutput(this.value, scope));
        }
    });

};
