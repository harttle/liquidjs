import 'regenerator-runtime/runtime'
import * as Scope from './scope'
import * as template from './template'
import * as _ from './util/underscore.js'
import assert from './util/assert.js'
import * as tokenizer from './tokenizer.js'
import Render from './render.js'
import Tag from './tag.js'
import Filter from './filter.js'
import Parser from './parser'
import { isTruthy, isFalsy, evalExp, evalValue } from './syntax.js'
import { ParseError, TokenizationError, RenderBreakError, AssertionError } from './util/error.js'
import tags from './tags/index.js'
import filters from './filters.js'

const _engine = {
  init: function (tag, filter, options) {
    if (options.cache) {
      this.cache = {}
    }
    this.options = options
    this.tag = tag
    this.filter = filter
    this.parser = Parser(tag, filter)
    this.renderer = Render()

    tags(this, Liquid)
    filters(this, Liquid)

    return this
  },
  parse: function (html, filepath) {
    const tokens = tokenizer.parse(html, filepath, this.options)
    return this.parser.parse(tokens)
  },
  render: function (tpl, ctx, opts) {
    opts = _.assign({}, this.options, opts)
    const scope = Scope.factory(ctx, opts)
    return this.renderer.renderTemplates(tpl, scope)
  },
  parseAndRender: async function (html, ctx, opts) {
    const tpl = await this.parse(html)
    return this.render(tpl, ctx, opts)
  },
  getTemplate: async function (file, root) {
    const filepath = await template.resolve(file, root, this.options)
    return this.respectCache(filepath, async () => {
      const str = await template.read(filepath)
      return this.parse(str, filepath)
    })
  },
  renderFile: async function (file, ctx, opts) {
    opts = _.assign({}, opts)
    const templates = await this.getTemplate(file, opts.root)
    return this.render(templates, ctx, opts)
  },
  respectCache: async function (key, getter) {
    const cacheEnabled = this.options.cache
    if (cacheEnabled && this.cache[key]) {
      return this.cache[key]
    }
    const value = await getter()
    if (cacheEnabled) {
      this.cache[key] = value
    }
    return value
  },
  evalValue: function (str, scope) {
    const tpl = this.parser.parseValue(str.trim())
    return this.renderer.evalValue(tpl, scope)
  },
  registerFilter: function (name, filter) {
    return this.filter.register(name, filter)
  },
  registerTag: function (name, tag) {
    return this.tag.register(name, tag)
  },
  plugin: function (plugin) {
    return plugin.call(this, Liquid)
  },
  express: function (opts) {
    opts = opts || {}
    const self = this
    return function (filePath, ctx, cb) {
      assert(_.isArray(this.root) || _.isString(this.root),
        'illegal views root, are you using express.js?')
      opts.root = this.root
      self.renderFile(filePath, ctx, opts).then(html => cb(null, html), cb)
    }
  }
}

function normalizeStringArray (value) {
  if (_.isArray(value)) return value
  if (_.isString(value)) return [value]
  throw new TypeError('illegal root: ' + value)
}

export default function Liquid (options) {
  options = _.assign({
    root: ['.'],
    cache: false,
    extname: '',
    dynamicPartials: true,
    trim_tag_right: false,
    trim_tag_left: false,
    trim_value_right: false,
    trim_value_left: false,
    greedy: true,
    strict_filters: false,
    strict_variables: false
  }, options)
  options.root = normalizeStringArray(options.root)

  const engine = _.create(_engine)
  engine.init(Tag(), Filter(options), options)
  return engine
}

Liquid.default = Liquid
Liquid.isTruthy = isTruthy
Liquid.isFalsy = isFalsy
Liquid.evalExp = evalExp
Liquid.evalValue = evalValue
Liquid.Types = {
  ParseError,
  TokenizationError,
  RenderBreakError,
  AssertionError,
  AssignScope: {},
  CaptureScope: {},
  IncrementScope: {},
  DecrementScope: {}
}
