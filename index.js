const Scope = require('./src/scope');
const tokenizer = require('./src/tokenizer.js');
const fs = require('fs');
const Render = require('./src/render.js');
const lexical = require('./src/lexical.js');
const Tag = require('./src/tag.js');
const Filter = require('./src/filter.js');
const Template = require('./src/parser');
const Syntax = require('./src/syntax.js');
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
    render: function(tpl, ctx, opts) {
        opts = opts || {};
        opts.strict_variables = opts.strict_variables || false;
        opts.strict_filters = opts.strict_filters || false;

        this.renderer.resetRegisters();
        var scope = Scope.factory(ctx, {
            strict: opts.strict_variables,
        });
        return this.renderer.renderTemplates(tpl, scope, opts);
    },
    parseAndRender: function(html, ctx, opts) {
        try {
            var tpl = this.parse(html);
            return this.render(tpl, ctx, opts);
        } catch (error) {
            // A throw inside of a then or catch of a Promise automatically rejects, but since we mix a sync call
            //  with an async call, we need to do this in case the sync call throws.
            return Promise.reject(error);
        }
    },
    renderFile: function(filepath, ctx, opts) {
        return this.handleCache(filepath)
            .then((templates) => {
                return this.render(templates, ctx, opts);
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
        if (!filepath) throw new Error('filepath cannot be null');

        return this.getTemplate(filepath)
            .then((html) => {
                var tpl = this.options.cache && this.cache[filepath] || this.parse(html);
                return this.options.cache ? (this.cache[filepath] = tpl) : tpl;
            });
    },
    getTemplate: function(filepath) {
        filepath = resolvePath(this.options.root, filepath);

        if (!filepath.match(/\.\w+$/)) {
            filepath += this.options.extname;
        }
        return new Promise(function(resolve, reject) {
            fs.readFile(filepath, 'utf8', function(err, html) {
                err ? reject(err) : resolve(html);
            });
        });
    },
    express: function(renderingOptions) {
        return (filePath, options, callback) => {
            this.renderFile(filePath, options, renderingOptions)
                .then(html => callback(null, html))
                .catch(e => callback(e));
        };
    }
};

function factory(options) {
    options = options || {};
    options.root = options.root || '';
    options.extname = options.extname || '.liquid';

    var engine = Object.create(_engine);

    engine.init(Tag(), Filter(), options);
    return engine;
}

function resolvePath(root, path) {
    if (path[0] == '/') return path;

    var arr = root.split('/').concat(path.split('/'));
    var result = [];
    arr.forEach(function(slug) {
        if (slug == '..') result.pop();
        else if (!slug || slug == '.');
        else result.push(slug);
    });
    return '/' + result.join('/');
}

factory.lexical = lexical;
factory.isTruthy = Syntax.isTruthy;
factory.isFalsy = Syntax.isFalsy;
factory.evalExp = Syntax.evalExp;
factory.evalValue = Syntax.evalValue;

module.exports = factory;
