const scope = require('./scope');
const tokenizer = require('./tokenizer.js');
const Render = require('./render.js');
const lexical = require('./lexical.js');
const path = require("path");
const fs = require('fs');
const Tag = require('./tag.js');
const Filter = require('./filter.js');
const Template = require('./parser');
const Expression = require('./expression.js');
const tagsPath = path.join(__dirname, "tags");

var _engine = {
    init: function(tag, filter) {
        this.tag = tag;
        this.filter = filter;
        this.parser = Template(tag, filter);
        this.renderer = Render();
        return this;
    },
    parse: function(html) {
        var tokens = tokenizer.parse(html);
        return this.parser.parse(tokens);
    },
    render: function(tpl, ctx) {
        this.renderer.resetRegisters();
        return this.renderer.renderTemplates(tpl, scope.factory(ctx));
    },
    parseAndRender: function(html, ctx) {
        var tpl = this.parse(html);
        return this.render(tpl, ctx);
    },
    evalOutput: function(str, scope) {
        var tpl = this.parser.parseOutput(str.trim());
        return this.renderer.evalOutput(tpl, scope);
    },
    registerFilter: function(name, filter) {
        return this.filter.register(name, filter);
    },
    registerTag: function(name, tag) {
        return this.tag.register(name, tag);
    },
};

function factory() {
    var engine = Object.create(_engine);
    engine.init(Tag(), Filter());
    registerTagsAndFilters(engine);
    return engine;
}

function registerTagsAndFilters(engine) {
    fs.readdirSync(tagsPath).map(f => {
        var match = /^(\w+)\.js$/.exec(f);
        if (!match) return;
        require("./tags/" + f)(engine);
    });
    require("./filters.js")(engine);
}

factory.lexical = lexical;
factory.isTruthy = Expression.isTruthy;
factory.isFalsy = Expression.isFalsy;
factory.evalExp = Expression.evalExp;
factory.evalValue = Expression.evalValue;

module.exports = factory;
