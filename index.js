const Scope = require('./src/scope')
const _ = require('./src/util/underscore.js')
const assert = require('./src/util/assert.js')
const tokenizer = require('./src/tokenizer.js')
const statFileAsync = require('./src/util/fs.js').statFileAsync
const readFileAsync = require('./src/util/fs.js').readFileAsync
const path = require('path')
const Render = require('./src/render.js')
const lexical = require('./src/lexical.js')
const Tag = require('./src/tag.js')
const Filter = require('./src/filter.js')
const Parser = require('./src/parser')
const Syntax = require('./src/syntax.js')
const tags = require('./tags')
const filters = require('./filters')
const Promise = require('any-promise')
const anySeries = require('./src/util/promise.js').anySeries
const Errors = require('./src/util/error.js')

var _engine = {
  init: function (tag, filter, options) {
    if (options.cache) {
      this.cache = {}
    }
    this.options = options
    this.tag = tag
    this.filter = filter
    this.parser = Parser(tag, filter)
    this.renderer = Render()

    tags(this)
    filters(this)

    return this
  },
  parse: function (html, filepath) {
    var tokens = tokenizer.parse(html, filepath, this.options)
    return this.parser.parse(tokens)
  },
  render: function (tpl, ctx, opts) {
    opts = _.assign({}, this.options, opts)
    var scope = Scope.factory(ctx, opts)
    return this.renderer.renderTemplates(tpl, scope)
  },
  parseAndRender: function (html, ctx, opts) {
    return Promise.resolve()
      .then(() => this.parse(html))
      .then(tpl => this.render(tpl, ctx, opts))
      .catch(e => {
        if (e instanceof Errors.RenderBreakError) {
          return e.html
        }
        throw e
      })
  },
  renderFile: function (filepath, ctx, opts) {
    opts = _.assign({}, opts)
    return this.getTemplate(filepath, opts.root)
      .then(templates => this.render(templates, ctx, opts))
  },
  evalOutput: function (str, scope) {
    var tpl = this.parser.parseOutput(str.trim())
    return this.renderer.evalOutput(tpl, scope)
  },
  registerFilter: function (name, filter) {
    return this.filter.register(name, filter)
  },
  registerTag: function (name, tag) {
    return this.tag.register(name, tag)
  },
  lookup: function (filepath, root) {
    root = this.options.root.concat(root || [])
    root = _.uniq(root)
    var paths = root.map(root => path.resolve(root, filepath))
    return anySeries(paths, path => statFileAsync(path).then(() => path))
      .catch((e) => {
        if (e.code === 'ENOENT') {
          e.message = `Failed to lookup ${filepath} in: ${root}`
        }
        throw e
      })
  },
  getTemplate: function (filepath, root) {
    if (!path.extname(filepath)) {
      filepath += this.options.extname
    }
    return this
      .lookup(filepath, root)
      .then(filepath => {
        if (this.options.cache) {
          var tpl = this.cache[filepath]
          if (tpl) {
            return Promise.resolve(tpl)
          }
          return readFileAsync(filepath)
                  .then(str => this.parse(str))
                  .then(tpl => (this.cache[filepath] = tpl))
        } else {
          return readFileAsync(filepath).then(str => this.parse(str, filepath))
        }
      })
  },
  express: function (opts) {
    opts = opts || {}
    var self = this
    return function (filePath, ctx, callback) {
      assert(Array.isArray(this.root) || _.isString(this.root),
        'illegal views root, are you using express.js?')
      opts.root = this.root
      self.renderFile(filePath, ctx, opts)
        .then(html => callback(null, html))
        .catch(e => callback(e))
    }
  }
}

function factory (options) {
  options = _.assign({
    root: ['.'],
    cache: false,
    extname: '.liquid',
    trim_right: false,
    trim_left: false,
    strict_filters: false,
    strict_variables: false
  }, options)
  options.root = normalizeStringArray(options.root)

  var engine = Object.create(_engine)
  engine.init(Tag(), Filter(options), options)
  return engine
}

function normalizeStringArray (value) {
  if (Array.isArray(value)) return value
  if (_.isString(value)) return [value]
  return []
}

factory.lexical = lexical
factory.isTruthy = Syntax.isTruthy
factory.isFalsy = Syntax.isFalsy
factory.evalExp = Syntax.evalExp
factory.evalValue = Syntax.evalValue
factory.Types = {
  ParseError: Errors.ParseError,
  TokenizationEroor: Errors.TokenizationError,
  RenderBreakError: Errors.RenderBreakError,
  AssertionError: Errors.AssertionError
}

module.exports = factory
