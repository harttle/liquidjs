const context = require('./context');
const tokenizer = require('./tokenizer.js');
const Render = require('./render.js');
const lexical = require('./lexical.js');
const path = require("path");
const fs = require('fs');
const Tag = require('./tag.js');
const Filter = require('./filter.js');

const tagsPath = path.join(__dirname, "tags");
const filtersPath = path.join(__dirname, "filters");

var _engine = {
    registerFilter : function(name, filter){
        return this.filter.register(name, filter);
    },
    registerTag : function(name, tag){
        return this.tag.register(name, tag);
    } 
};

function factory(){
    var engine = Object.create(_engine);
    engine.tag = Tag();
    engine.filter = Filter();

    var renderer = Render(engine.filter, engine.tag);
    engine.evaluate = renderer.evaluate;
    engine.renderTokens = renderer.render;
    engine.render = function(html, ctx) {
        return engine.renderTokens(tokenizer.parse(html), context.factory(ctx));
    },

    fs.readdirSync(tagsPath).map(function(f){
        var match = /^(\w+)\.js$/.exec(f);
        if(!match) return;
        require("./tags/" + f)(engine);
    });

    fs.readdirSync(filtersPath).map(function(f){
        var match = /^(\w+)\.js$/.exec(f);
        if(!match) return;
        require("./filters/" + f)(engine);
    });
    return engine;
}

factory.lexical = lexical;

module.exports = factory;
