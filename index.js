const Scope = require('./src/scope');
const _ = require('./src/util/underscore.js');
const tokenizer = require('./src/tokenizer.js');
const statFileAsync = require('./src/util/fs.js').statFileAsync;
const readFileAsync = require('./src/util/fs.js').readFileAsync;
const pathResolve = require('./src/util/fs.js').pathResolve;
const Render = require('./src/render.js');
const lexical = require('./src/lexical.js');
const Tag = require('./src/tag.js');
const Filter = require('./src/filter.js');
const Template = require('./src/parser');
const Syntax = require('./src/syntax.js');
const tags = require('./tags');
const filters = require('./filters');
const Promise = require('any-promise');
const anySeries = require('./src/util/promise.js').anySeries;
const Errors = require('./src/util/error.js');

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
        return Promise.resolve()
            .then(() => this.parse(html))
            .then(tpl => this.render(tpl, ctx, opts))
            .catch(e => {
                if (e instanceof Errors.RenderBreak) {
                    return e.html;
                }
                throw e;
            });
    },
    renderFile: function(filepath, ctx, opts) {
        return this.getTemplate(filepath)
            .then((templates) => {
                return this.render(templates, ctx, opts);
            })
            .catch((e) => {
                e.file = filepath;
                if (e.code === 'ENOENT') {
                    e.message = `Failed to lookup ${filepath} in: ${this.options.root}`;
                }
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
    lookup: function(filepath) {
        var paths = this.options.root.map(root => pathResolve(root, filepath));
        return anySeries(paths, path => statFileAsync(path).then(() => path));
    },
    getTemplate: function(filepath) {
        if (!filepath.match(/\.\w+$/)) {
            filepath += this.options.extname;
        }
        return this
            .lookup(filepath)
            .then(filepath => {
                if (this.options.cache) {
                    var tpl = this.cache[filepath];
                    if (tpl) {
                        return Promise.resolve(tpl);
                    }
                    return readFileAsync(filepath)
                        .then(str => this.parse(str))
                        .then(tpl => this.cache[filepath] = tpl);
                } else {
                    return readFileAsync(filepath).then(str => this.parse(str));
                }
            });
    },
    express: function(renderOption) {
        renderOption = renderOption || {};
        return (filePath, options, callback) => {
            this.renderFile(filePath, options, renderOption)
                .then(html => callback(null, html))
                .catch(e => callback(e));
        };
    }
};

function factory(options) {
    options = options || {};
    options.root = normalizeStringArray(options.root);
    if (!options.root.length) options.root = ['.'];

    options.extname = options.extname || '.liquid';

    var engine = Object.create(_engine);

    engine.init(Tag(), Filter(), options);
    return engine;
}

function normalizeStringArray(value) {
    if (_.isArray(value)) return value;
    if (_.isString(value)) return [value];
    return [];
}

factory.lexical = lexical;
factory.isTruthy = Syntax.isTruthy;
factory.isFalsy = Syntax.isFalsy;
factory.evalExp = Syntax.evalExp;
factory.evalValue = Syntax.evalValue;
factory.Types = {
    ParseError: Errors.ParseError,
    TokenizationEroor: Errors.TokenizationError,
    RenderBreak: Errors.RenderBreak
};

module.exports = factory;
