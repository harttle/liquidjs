const lexical = require('./lexical.js');
const Promise = require('any-promise');
const Syntax = require('./syntax.js');
const assert = require('./util/assert.js');

function hash(markup, scope) {
    var obj = {}, match;
    lexical.hashCapture.lastIndex = 0;
    while (match = lexical.hashCapture.exec(markup)) {
        var k = match[1],
            v = match[2];
        obj[k] = Syntax.evalValue(v, scope);
    }
    return obj;
}

module.exports = function() {
    var tagImpls = {};

    var _tagInstance = {
        render: function(scope, register) {
            var obj = hash(this.token.args, scope);
            return this.tagImpl.render && this.tagImpl.render(scope, obj, register) || Promise.resolve('');
        },
        parse: function(token, tokens){
            this.type = 'tag';
            this.token = token;
            this.name = token.name;

            var tagImpl = tagImpls[this.name];
            assert(tagImpl, `tag ${this.name} not found`);
            this.tagImpl = Object.create(tagImpl);
            if(this.tagImpl.parse){
                this.tagImpl.parse(token, tokens);
            }
        }
    };

    function register(name, tag) {
        tagImpls[name] = tag;
    }

    function construct(token, tokens) {
        var instance = Object.create(_tagInstance);
        instance.parse(token, tokens);
        return instance;
    }

    function clear() {
        tagImpls = {};
    }

    return {
        construct, register, clear
    };
};
