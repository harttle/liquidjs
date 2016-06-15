const _ = require('lodash');
const lexical = require('./lexical.js');

var scope = {
    get: function(str) {
        str = str && str.trim();
        if(!str) return '';

        if (lexical.isLiteral(str)) {
            var a = lexical.parseLiteral(str);
            return lexical.parseLiteral(str);
        }
        if (lexical.isVariable(str)) {
            for (var i = this.scopes.length - 1; i >= 0; i--) {
                var v = _.get(this.scopes[i], str);
                if (v !== undefined) return v;
            }
        }
        return '';
    },
    set: function(k, v){
        this.scopes[this.scopes.length-1][k] = v;
        return this;
    },
    push: function(ctx) {
        return this.scopes.push(ctx);
    },
    pop: function() {
        return this.scopes.pop();
    }
};

exports.factory = function(_ctx) {
    var ctx = Object.create(scope);
    ctx.scopes = [_ctx];
    return ctx;
};
