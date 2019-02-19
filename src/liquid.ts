import Scope from './scope/scope'
import * as Types from './types'
import fs from 'src/fs'
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
import { LiquidOptions, NormalizedOptions, defaultOptions, normalize } from './liquid-options'

export default class Liquid {
  public options: NormalizedOptions
  private cache: object
  private parser: Parser
  private renderer: Render
  private tokenizer: Tokenizer

  constructor (opts: LiquidOptions = {}) {
    const options = { ...defaultOptions, ...normalize(opts) }
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
    const options = { ...this.options, ...normalize(opts) }
    const scope = new Scope(ctx, options)
    return this.renderer.renderTemplates(tpl, scope)
  }
  async parseAndRender (html: string, ctx?: object, opts?: LiquidOptions) {
    const tpl = await this.parse(html)
    return this.render(tpl, ctx, opts)
  }
  async getTemplate (file, opts?: LiquidOptions) {
    const options = normalize(opts)
    const roots = options.root ? [...options.root, ...this.options.root] : this.options.root
    const paths = roots.map(root => fs.resolve(root, file, this.options.extname))

    for (const filepath of paths) {
      if (!(await fs.exists(filepath))) continue

      if (this.options.cache && this.cache[filepath]) return this.cache[filepath]
      const value = this.parse(await fs.readFile(filepath), filepath)
      if (this.options.cache) this.cache[filepath] = value
      return value
    }

    const err = new Error('ENOENT') as any
    err.message = `ENOENT: Failed to lookup "${file}" in "${roots}"`
    err.code = 'ENOENT'
    throw err
  }
  async renderFile (file, ctx?: object, opts?: LiquidOptions) {
    const options = normalize(opts)
    const templates = await this.getTemplate(file, options)
    return this.render(templates, ctx, opts)
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
  express () {
    const self = this
    return function (filePath: string, ctx: object, cb: (err: Error, html?: string) => void) {
      const opts = { root: this.root }
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
