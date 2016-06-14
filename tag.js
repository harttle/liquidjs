const lexical = require('./lexical.js');
const context = require('./context.js');

var tags = {};

var _tagInstance = {
    render: function(tokens, ctx){
        var obj = hash(this.markup, ctx);
        return this.tag.render(tokens, ctx, this.markup, obj);
    }
};

function register(name, tag){
    if(typeof tag.render !== 'function'){
        throw new Error(`expect ${name}.render to be a function`);
    }
    tags[name] = tag;
}

function parse(str){
    var match = lexical.patterns.identifier.exec(str.trim());
    if(!match) throw new Error('illegal tag: '+ str);

    var tagInstance = factory(match[0], str);
    return tagInstance;
}

function hash(markup, ctx){
    var obj = {};
    lexical.patterns.hash.lastIndex = 0;
    while(match = lexical.patterns.hash.exec(markup)){
        var k = match[1], v = match[2];
        if(!k) continue;
        obj[k] = ctx.get(v);
    }
    return obj;
}

function factory(name, markup){
    var tag = tags[name];
    if(!tag) throw new Error(`tag ${name} not found`);
    
    var instance = Object.create(_tagInstance);
    instance.name = name;
    instance.markup = markup;
    instance.tag = tag;
    return instance;
}

function clear(){
    tags = {};
}

exports.parse = parse;
exports.register = register;
exports.hash = hash;
exports.clear = clear;
