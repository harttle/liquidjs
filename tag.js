const lexical = require('./lexical.js');

var _tagInstance = {
    render: function(tokens, scope) {
        var obj = hash(this.token.args, scope);
        var res = this.tag.render(tokens, scope, this.token, obj);
        return res === undefined ? '' : res;
    }
};

function hash(markup, scope) {
    var obj = {};
    lexical.hash.lastIndex = 0;
    while (match = lexical.hash.exec(markup)) {
        var k = match[1],
            v = match[2];
        if (!k) continue;
        obj[k] = scope.get(v);
    }
    return obj;
}

module.exports = function() {
    var tags = {};

    function register(name, tag) {
        if (typeof tag.render !== 'function') {
            throw new Error(`expect ${name}.render to be a function`);
        }
        tags[name] = tag;
    }

    function construct(token) {
        var tag = tags[token.name];
        if (!tag) throw new Error(`tag ${token.name} not found`);

        var instance = Object.create(_tagInstance);
        instance.token = token;
        instance.tag = tag;
        instance.needClose = tag.needClose;
        return instance;
    }

    function clear() {
        tags = {};
    }

    return {
        construct, register, hash, clear
    };
};
