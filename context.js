const _ = require('lodash');
const lexical = require('./lexical.js');

var context = {
    get: function(str) {
        str = str && str.trim();
        if(!str) return '';

        if (lexical.isLiteral(str)) {
            var a = lexical.parseLiteral(str);
            return lexical.parseLiteral(str);
        }
        if (lexical.isVariable(str)) {
            for (var i = this.context.length - 1; i >= 0; i--) {
                var v = _.get(this.context[i], str);
                if (v !== undefined) return v;
            }
        }
        return '';
    },
    set: function(k, v){
        this.context[this.context.length-1][k] = v;
        return this;
    },
    push: function(ctx) {
        return this.context.push(ctx);
    },
    pop: function() {
        return this.context.pop();
    }
};

exports.factory = function(_ctx) {
    var ctx = Object.create(context);
    ctx.context = [_ctx];
    return ctx;
};
