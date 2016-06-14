const context = require('./context');
const tokenizer = require('./tokenizer.js');
const render = require('./render.js');
const lexical = require('./lexical.js');
const path = require("path");
const fs = require('fs');
const Tag = require('./tag.js');
const Filter = require('./filter.js');

const tagsPath = path.join(__dirname, "tags");
const filtersPath = path.join(__dirname, "filters");

var _engine = {
    render: function(html, ctx) {
        return this.doRender(tokenizer.parse(html), context.factory(ctx));
    },
    lexical,
    registerFilter : function(name, filter){
        return this.filter.register(name, filter);
    },
    registerTag : function(name, tag){
        return this.filter.register(name, tag);
    } 
};

function factory(){
    var engine = Object.create(_engine);
    engine.tag = Tag();
    engine.filter = Filter();
    engine.doRender = render(engine.filter, engine.tag);

    fs.readdirSync(tagsPath).map(function(f){
        var match = /^(\w+)\.js$/.exec(f);
        if(!match) return;
        engine.tag.register(match[1], require("./tags/" + f));
    });

    fs.readdirSync(filtersPath).map(function(f){
        var match = /^(\w+)\.js$/.exec(f);
        if(!match) return;
        engine.filter.register(match[1], require("./filters/" + f));
    });
    return engine;
}

module.exports = factory;
