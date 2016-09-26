const _ = require('lodash');
const lexical = require('./lexical.js');

var Scope = {
    safeGet: function(str) {
        var i;
        // get all
        if (str === undefined) {
            var ctx = {};
            for (i = this.scopes.length - 1; i >= 0; i--) {
                _.merge(ctx, this.scopes[i]);
            }
            return ctx;
        }
        // get one path
        for (i = this.scopes.length - 1; i >= 0; i--) {
            var v = _.get(this.scopes[i], str);
            if (v !== undefined) return v;
        }
    },
    get: function(str){
        var val = this.safeGet(str);
        if (val === undefined && this.opts.strict) {
            throw new Error(`[strict_variables] undefined variable: ${str}`);
        }
        return val;
    },
    set: function(k, v) {
        _.set(this.scopes[this.scopes.length - 1], k, v);
        return this;
    },
    push: function(ctx) {
        if (!ctx) throw new Error(`trying to push ${ctx} into scopes`);
        return this.scopes.push(ctx);
    },
    pop: function() {
        return this.scopes.pop();
    }
};

exports.factory = function(_ctx, opts) {
    opts = _.defaults(opts, {
        strict: false
    });

    var scope = Object.create(Scope);
    scope.opts = opts;
    scope.scopes = [_ctx || {}];
    return scope;
};
