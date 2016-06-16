const lexical = require('./lexical.js');

var _tagInstance = {
    render: function(scope) {
        var obj = hash(this.token.args, scope);
        return this.tagImpl.render(scope, obj) || '';
    },
    parse: function(tokens){
        this.tagImpl.parse(this.token, tokens);
        return this;
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
    var tagImpls = {};

    function register(name, tag) {
        if (typeof tag.render !== 'function') {
            throw new Error(`expect ${name}.render to be a function`);
        }
        tagImpls[name] = tag;
    }

    function construct(token) {
        var tagImpl = tagImpls[token.name];
        if (!tagImpl) throw new Error(`tag ${token.name} not found`);

        var instance = Object.create(_tagInstance);
        instance.token = token;
        instance.type = 'tag';
        instance.name = token.name;
        instance.tagImpl = Object.create(tagImpl);
        return instance;
    }

    function clear() {
        tagImpls = {};
    }

    return {
        construct, register, hash, clear
    };
};
