import Scope from './scope'
import * as template from './template'
import * as _ from './util/underscore'
import assert from './util/assert'
import * as tokenizer from './tokenizer'
import Render from './render'
import Tag from './tag'
import Filter from './filter'
import Parser from './parser'
import { isTruthy, isFalsy, evalExp, evalValue } from './syntax'
import { ParseError, TokenizationError, RenderBreakError, AssertionError } from './util/error'
import tags from './tags/index'
import filters from './filters'

export default class Liquid {
  private cache: object
  private options: any
  private tags: any
  private filters: any
  private parser: any
  private renderer: any

  constructor (options) {
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

    if (options.cache) {
      this.cache = {}
    }
    this.options = options
    this.tags = Tag()
    this.filters = Filter(options)
    this.parser = Parser(this.tags, this.filters)
    this.renderer = Render()

    tags(this, Liquid)
    filters(this, Liquid)
  }
  parse(html: string, filepath?: string) {
    const tokens = tokenizer.parse(html, filepath, this.options)
    return this.parser.parse(tokens)
  }
  render(tpl: string, ctx: any, opts: any) {
    opts = _.assign({}, this.options, opts)
    const scope = new Scope(ctx, opts)
    return this.renderer.renderTemplates(tpl, scope)
  }
  async parseAndRender(html, ctx, opts) {
    const tpl = await this.parse(html)
    return this.render(tpl, ctx, opts)
  }
  async getTemplate(file, root) {
    const filepath = await template.resolve(file, root, this.options)
    return this.respectCache(filepath, async () => {
      const str = await template.read(filepath)
      return this.parse(str, filepath)
    })
  }
  async renderFile(file, ctx, opts) {
    opts = _.assign({}, opts)
    const templates = await this.getTemplate(file, opts.root)
    return this.render(templates, ctx, opts)
  }
  async respectCache (key, getter) {
    const cacheEnabled = this.options.cache
    if (cacheEnabled && this.cache[key]) {
      return this.cache[key]
    }
    const value = await getter()
    if (cacheEnabled) {
      this.cache[key] = value
    }
    return value
  }
  evalValue (str, scope) {
    const tpl = this.parser.parseValue(str.trim())
    return this.renderer.evalValue(tpl, scope)
  }
  registerFilter (name, filter) {
    return this.filters.register(name, filter)
  }
  registerTag (name, tag) {
    return this.tags.register(name, tag)
  }
  plugin (plugin) {
    return plugin.call(this, Liquid)
  }
  express (opts) {
    opts = opts || {}
    const self = this
    return function (filePath, ctx, cb) {
      assert(_.isArray(this.root) || _.isString(this.root),
        'illegal views root, are you using express.js?')
      opts.root = this.root
      self.renderFile(filePath, ctx, opts).then(html => cb(null, html), cb)
    }
  }
  static default = Liquid
  static isTruthy = isTruthy
  static isFalsy = isFalsy
  static evalExp = evalExp
  static evalValue = evalValue
  static Types = {
    ParseError,
    TokenizationError,
    RenderBreakError,
    AssertionError,
    AssignScope: {},
    CaptureScope: {},
    IncrementScope: {},
    DecrementScope: {}
  }
}

function normalizeStringArray (value) {
  if (_.isArray(value)) return value
  if (_.isString(value)) return [value]
  throw new TypeError('illegal root: ' + value)
}
