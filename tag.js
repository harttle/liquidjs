const lexical = require('./lexical.js');

var _tagInstance = {
    render: function(tokens, ctx) {
        var obj = hash(this.markup, ctx);
        var res = this.tag.render(tokens, ctx, this.markup, obj);
        return res === undefined ? '' : res;
    }
};

function hash(markup, ctx) {
    var obj = {};
    lexical.patterns.hash.lastIndex = 0;
    while (match = lexical.patterns.hash.exec(markup)) {
        var k = match[1],
            v = match[2];
        if (!k) continue;
        obj[k] = ctx.get(v);
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
        instance.name = token.name;
        instance.markup = token.value;
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
