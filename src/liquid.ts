import Scope from './scope/scope'
import * as Types from './types'
import fs from './fs/node'
import * as _ from './util/underscore'
import ITemplate from './template/itemplate'
import Tokenizer from './parser/tokenizer'
import Render from './render/render'
import Tag from './template/tag/tag'
import Filter from './template/filter/filter'
import Parser from './parser/parser'
import ITagImplOptions from './template/tag/itag-impl-options'
import Value from './template/value'
import { isTruthy, isFalsy, evalExp, evalValue } from './render/syntax'
import builtinTags from './builtin/tags'
import builtinFilters from './builtin/filters'
import { LiquidOptions, NormalizedFullOptions, applyDefault, normalize } from './liquid-options'
import { FilterImpl } from './template/filter/filter-impl'

export default class Liquid {
  public options: NormalizedFullOptions
  public renderer: Render
  public parser: Parser
  private cache: object = {}
  private tokenizer: Tokenizer

  constructor (opts: LiquidOptions = {}) {
    this.options = applyDefault(normalize(opts))
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
  syncParseAndRender (html: string, ctx?: object, opts?: LiquidOptions) {
    const tpl = this.parse(html)
    return this.render(tpl, ctx, opts)
  }
  async parseAndRender (html: string, ctx?: object, opts?: LiquidOptions) {
    const tpl = await this.parse(html)
    return this.render(tpl, ctx, opts)
  }
  async getTemplate (file: string, opts?: LiquidOptions) {
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
  async renderFile (file: string, ctx?: object, opts?: LiquidOptions) {
    const options = normalize(opts)
    const templates = await this.getTemplate(file, options)
    return this.render(templates, ctx, opts)
  }
  evalValue (str: string, scope: Scope) {
    return new Value(str, this.options.strictFilters).value(scope)
  }
  registerFilter (name: string, filter: FilterImpl) {
    return Filter.register(name, filter)
  }
  registerTag (name: string, tag: ITagImplOptions) {
    return Tag.register(name, tag)
  }
  plugin (plugin: (this: Liquid, L: typeof Liquid) => void) {
    return plugin.call(this, Liquid)
  }
  express () {
    const self = this
    return function (this: any, filePath: string, ctx: object, cb: (err: Error | null, html?: string) => void) {
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
