const _ = require('./util/underscore.js');

var Scope = {
    safeGet: function(str) {
        var i;
        // get all
        if (str === undefined) {
            var ctx = {};
            for (i = this.scopes.length - 1; i >= 0; i--) {
                var scp = this.scopes[i];
                for (var k in scp) {
                    if (scp.hasOwnProperty(k)) {
                        ctx[k] = scp[k];
                    }
                }
            }
            return ctx;
        }
        // get one path
        for (i = this.scopes.length - 1; i >= 0; i--) {
            var v = getPropertyByPath(this.scopes[i], str);
            if (v !== undefined) return v;
        }
    },
    get: function(str) {
        var val = this.safeGet(str);
        if (val === undefined && this.opts.strict) {
            throw new Error(`[strict_variables] undefined variable: ${str}`);
        }
        return val;
    },
    set: function(k, v) {
        setPropertyByPath(this.scopes[this.scopes.length - 1], k, v);
        return this;
    },
    push: function(ctx) {
        if (!ctx) throw new Error(`trying to push ${ctx} into scopes`);
        return this.scopes.push(ctx);
    },
    pop: function() {
        return this.scopes.pop();
    },
    unshift: function(ctx) {
        if (!ctx) throw new Error('trying to push $(ctx) into scopes');
        return this.scopes.unshift(ctx);
    },
    shift: function() {
        return this.scopes.shift();
    }
};

function setPropertyByPath(obj, path, val) {
    if (_.isString(path)) {
        var paths = path.replace(/\[/g, '.').replace(/\]/g, '').split('.');
        for (var i = 0; i < paths.length; i++) {
            var key = paths[i];
            if (i === paths.length - 1) {
                return obj[key] = val;
            }
            if (undefined === obj[key]) obj[key] = {};
            // case for readonly objects
            obj = obj[key] || {};
        }
        return obj;
    }
    return obj[path] = val;
}

function getPropertyByPath(obj, path) {
    if (_.isString(path)) {
        var paths = path.replace(/\[/g, '.').replace(/\]/g, '').split('.');
        paths.forEach(p => obj = obj && obj[p]);
        return obj;
    }
    return obj[path];
}

exports.factory = function(_ctx, opts) {
    opts = opts || {};
    opts.strict = opts.strict || false;

    var scope = Object.create(Scope);
    scope.opts = opts;
    scope.scopes = [_ctx || {}];
    return scope;
};
