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
const tags = require('./tags');
const filters = require('./filters');
const Promise = require('any-promise');

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

        tags(this);
        filters(this);

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
        try {
            var tpl = this.parse(html);
            return this.render(tpl, ctx);
        }
        catch (error) {
            // A throw inside of a then or catch of a Promise automatically rejects, but since we mix a sync call
            //  with an async call, we need to do this in case the sync call throws.
            return Promise.reject(error);
        }
    },
    renderFile: function(filepath, ctx) {
        return this.handleCache(filepath)
            .then((templates) => {
                return this.render(templates, ctx);
            })
            .catch((e) => {
                e.file = filepath;
                throw e;
            });
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
        if (path.extname(filepath) === '') {
            filepath += this.options.extname;
        }

        return this.getTemplate(filepath)
            .then((html) => {
                var tpl = this.options.cache && this.cache[filepath] || this.parse(html);
                return this.options.cache ? (this.cache[filepath] = tpl) : tpl;
            });
    },
    getTemplate: function(filepath) {
        var html = fs.readFileSync(filepath, 'utf8');
        return Promise.resolve(html);
    },
    express: function() {
        return (filePath, options, callback) => {
            this.renderFile(filePath, options)
                .then(html => callback(null, html))
                .catch(e => callback(e));
        };
    }
};

function factory(options) {
    options = _.defaults(options || {
        root: '',
        extname: '.liquid'
    });
    var engine = Object.create(_engine);

    engine.init(Tag(), Filter(), options);
    return engine;
}

factory.lexical = lexical;
factory.isTruthy = Expression.isTruthy;
factory.isFalsy = Expression.isFalsy;
factory.evalExp = Expression.evalExp;
factory.evalValue = Expression.evalValue;

module.exports = factory;
