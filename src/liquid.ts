import Scope from './scope/scope'
import * as Types from './types'
import * as template from 'template'
import * as _ from './util/underscore'
import ITemplate from './template/itemplate'
import Tokenizer from './parser/tokenizer'
import Render from './render/render'
import Tag from './template/tag/tag'
import Filter from './template/filter'
import Parser from './parser/parser'
import ITagImplOptions from './template/tag/itag-impl-options'
import Value from './template/value'
import { isTruthy, isFalsy, evalExp, evalValue } from './render/syntax'
import builtinTags from './builtin/tags'
import builtinFilters from './builtin/filters'
import { LiquidOptions, defaultOptions } from './liquid-options'

export default class Liquid {
  public options: LiquidOptions
  private cache: object
  private parser: Parser
  private renderer: Render
  private tokenizer: Tokenizer

  constructor (options: LiquidOptions = {}) {
    options = _.assign({}, defaultOptions, options)
    options.root = normalizeStringArray(options.root)

    if (options.cache) {
      this.cache = {}
    }
    this.options = options
    this.parser = new Parser(this)
    this.renderer = new Render()
    this.tokenizer = new Tokenizer(this.options)

    _.forOwn(builtinTags, (conf, name) => this.registerTag(name, conf))
    _.forOwn(builtinFilters, (handler, name) => this.registerFilter(name, handler))
  }
  parse (html: string, filepath?: string) {
    const tokens = this.tokenizer.tokenize(html, filepath)
    return this.parser.parse(tokens)
  }
  render (tpl: Array<ITemplate>, ctx?: object, opts?: LiquidOptions) {
    opts = _.assign({}, this.options, opts)
    const scope = new Scope(ctx, opts)
    return this.renderer.renderTemplates(tpl, scope)
  }
  async parseAndRender (html: string, ctx?: object, opts?: LiquidOptions) {
    const tpl = await this.parse(html)
    return this.render(tpl, ctx, opts)
  }
  async getTemplate (file, root) {
    const filepath = await template.resolve(file, root, this.options)
    return this.respectCache(filepath, async () => {
      const str = await template.read(filepath)
      return this.parse(str, filepath)
    })
  }
  async renderFile (file, ctx?: object, opts?: LiquidOptions) {
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
  evalValue (str: string, scope: Scope) {
    return new Value(str, this.options.strict_filters).value(scope)
  }
  registerFilter (name, filter) {
    return Filter.register(name, filter)
  }
  registerTag (name: string, tag: ITagImplOptions) {
    return Tag.register(name, tag)
  }
  plugin (plugin) {
    return plugin.call(this, Liquid)
  }
  express (opts: LiquidOptions = {}) {
    const self = this
    return function (filePath, ctx, cb) {
      opts.root = this.root
      self.renderFile(filePath, ctx, opts).then(html => cb(null, html), cb)
    }
  }
  static default = Liquid
  static isTruthy = isTruthy
  static isFalsy = isFalsy
  static evalExp = evalExp
  static evalValue = evalValue
  static Types = Types
}

function normalizeStringArray (value) {
  if (_.isArray(value)) return value
  if (_.isString(value)) return [value]
  throw new TypeError('illegal root: ' + value)
}
