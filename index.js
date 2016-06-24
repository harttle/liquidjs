const scope = require('./src/scope');
const assert = require('assert');
const _ = require('lodash');
const tokenizer = require('./src/tokenizer.js');
const Render = require('./src/render.js');
const lexical = require('./src/lexical.js');
const path = require("path");
const fs = require('fs');
const Tag = require('./src/tag.js');
const Filter = require('./src/filter.js');
const Template = require('./src/parser');
const Expression = require('./src/expression.js');
const tagsPath = path.join(__dirname, "tags/");
const filtersPath = path.join(__dirname, "filters.js");

var _engine = {
    init: function(tag, filter, options) {
        if (options.cache) {
            this.cache = {};
        }
        this.options = options;
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
    renderFile: function(filepath, ctx) {
        var tpl = this.handleCache(filepath);
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
    handleCache: function(filepath) {
        assert(filepath, 'filepath cannot be null');
        filepath = path.resolve(this.options.root, filepath);
        if(path.extname(filepath) === ''){
            filepath += this.options.extname;
        }
        var tpl = this.options.cache && this.cache[filepath] ||
            this.parse(fs.readFileSync(filepath, 'utf8'));
        return this.options.cache ? (this.cache[filepath] = tpl) : tpl;
    }
};

function factory(options) {
    options = _.defaults(options || {
        root: '',
        extname: '.liquid'
    });
    var engine = Object.create(_engine);

    engine.init(Tag(), Filter(), options);
    registerTagsAndFilters(engine);
    return engine;
}

function registerTagsAndFilters(engine) {
    fs.readdirSync(tagsPath).map(f => {
        var match = /^(\w+)\.js$/.exec(f);
        if (!match) return;
        require("./tags/" + f)(engine);
    });
    require(filtersPath)(engine);
}

factory.lexical = lexical;
factory.isTruthy = Expression.isTruthy;
factory.isFalsy = Expression.isFalsy;
factory.evalExp = Expression.evalExp;
factory.evalValue = Expression.evalValue;

module.exports = factory;
