const _ = require('lodash');
const lexical = require('./lexical.js');
const error = require('./error.js');

var scope = {
    get: function(str) {
        var ctx = {};
        for (var i = this.scopes.length - 1; i >= 0; i--) {
            if(str === undefined){
                _.merge(ctx, this.scopes[i]);
            }
            var v = _.get(this.scopes[i], str);
            if (v !== undefined) return v;
            if(str === undefined){
                return ctx;
            }
        }
    },
    set: function(k, v) {
        _.set(this.scopes[this.scopes.length - 1], k, v);
        return this;
    },
    push: function(ctx) {
        if (!ctx) error(`trying to push ${ctx} into scopes`);
        return this.scopes.push(ctx);
    },
    pop: function() {
        return this.scopes.pop();
    }
};

exports.factory = function(_ctx) {
    var ctx = Object.create(scope);
    ctx.scopes = _ctx ? [_ctx] : [];
    return ctx;
};
