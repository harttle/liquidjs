const lexical = require('./lexical.js');
const Exp = require('./expression.js');
const TokenizationError = require('./error.js').TokenizationError;

var _tagInstance = {
    render: function(scope, register) {
        var reg = register[this.name];
        if(!reg) reg = register[this.name] = {};
        var obj = hash(this.token.args, scope);
        return this.tagImpl.render(scope, obj, reg) || '';
    },
    parse: function(tokens){
        if(this.tagImpl.parse){
            this.tagImpl.parse(this.token, tokens);
        }
        return this;
    }
};

function hash(markup, scope) {
    var obj = {};
    lexical.hashCapture.lastIndex = 0;
    while (match = lexical.hashCapture.exec(markup)) {
        var k = match[1],
            v = match[2];
        obj[k] = Exp.evalValue(v, scope);
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
