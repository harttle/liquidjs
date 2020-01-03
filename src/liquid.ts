import { Context } from './context/context'
import fs from './fs/node'
import * as _ from './util/underscore'
import { ITemplate } from './template/itemplate'
import { Tokenizer } from './parser/tokenizer'
import { Render } from './render/render'
import { Tag } from './template/tag/tag'
import { Filter } from './template/filter/filter'
import Parser from './parser/parser'
import { ITagImplOptions } from './template/tag/itag-impl-options'
import { Value } from './template/value'
import builtinTags from './builtin/tags'
import builtinFilters from './builtin/filters'
import { LiquidOptions, normalizeStringArray, NormalizedFullOptions, applyDefault, normalize } from './liquid-options'
import { FilterImplOptions } from './template/filter/filter-impl-options'
import IFS from './fs/ifs'
import { toThenable, toValue } from './util/async'

export * from './types'

export class Liquid {
  public options: NormalizedFullOptions
  public renderer: Render
  public parser: Parser
  private cache: object = {}
  private tokenizer: Tokenizer
  private fs: IFS

  public constructor (opts: LiquidOptions = {}) {
    this.options = applyDefault(normalize(opts))
    this.parser = new Parser(this)
    this.renderer = new Render()
    this.tokenizer = new Tokenizer(this.options)
    this.fs = opts.fs || fs

    _.forOwn(builtinTags, (conf, name) => this.registerTag(name, conf))
    _.forOwn(builtinFilters, (handler, name) => this.registerFilter(name, handler))
  }
  public parse (html: string, filepath?: string): ITemplate[] {
    const tokens = this.tokenizer.tokenize(html, filepath)
    return this.parser.parse(tokens)
  }

  public _render (tpl: ITemplate[], scope?: object, opts?: LiquidOptions, sync?: boolean): IterableIterator<string> {
    const options = { ...this.options, ...normalize(opts) }
    const ctx = new Context(scope, options, sync)
    return this.renderer.renderTemplates(tpl, ctx)
  }
  public async render (tpl: ITemplate[], scope?: object, opts?: LiquidOptions): Promise<string> {
    return toThenable(this._render(tpl, scope, opts, false))
  }
  public renderSync (tpl: ITemplate[], scope?: object, opts?: LiquidOptions): string {
    return toValue(this._render(tpl, scope, opts, true))
  }

  public _parseAndRender (html: string, scope?: object, opts?: LiquidOptions, sync?: boolean): IterableIterator<string> {
    const tpl = this.parse(html)
    return this._render(tpl, scope, opts, sync)
  }
  public async parseAndRender (html: string, scope?: object, opts?: LiquidOptions): Promise<string> {
    return toThenable(this._parseAndRender(html, scope, opts, false))
  }
  public parseAndRenderSync (html: string, scope?: object, opts?: LiquidOptions): string {
    return toValue(this._parseAndRender(html, scope, opts, true))
  }

  public * _parseFile (file: string, opts?: LiquidOptions, sync?: boolean) {
    const options = { ...this.options, ...normalize(opts) }
    const paths = options.root.map(root => this.fs.resolve(root, file, options.extname))
    if (this.fs.fallback !== undefined) {
      const filepath = this.fs.fallback(file)
      if (filepath !== undefined) paths.push(filepath)
    }

    for (const filepath of paths) {
      if (this.options.cache && this.cache[filepath]) return this.cache[filepath]
      if (!(sync ? this.fs.existsSync(filepath) : yield this.fs.exists(filepath))) continue
      const tpl = this.parse(sync ? this.fs.readFileSync(filepath) : yield this.fs.readFile(filepath), filepath)
      return (this.cache[filepath] = tpl)
    }
    throw this.lookupError(file, options.root)
  }
  public async parseFile (file: string, opts?: LiquidOptions): Promise<ITemplate[]> {
    return toThenable(this._parseFile(file, opts, false))
  }
  public parseFileSync (file: string, opts?: LiquidOptions): ITemplate[] {
    return toValue(this._parseFile(file, opts, true))
  }
  public async renderFile (file: string, ctx?: object, opts?: LiquidOptions) {
    const templates = await this.parseFile(file, opts)
    return this.render(templates, ctx, opts)
  }
  public renderFileSync (file: string, ctx?: object, opts?: LiquidOptions) {
    const options = normalize(opts)
    const templates = this.parseFileSync(file, options)
    return this.renderSync(templates, ctx, opts)
  }

  public _evalValue (str: string, ctx: Context): IterableIterator<any> {
    const value = new Value(str, this.options.strictFilters)
    return value.value(ctx)
  }
  public async evalValue (str: string, ctx: Context): Promise<any> {
    return toThenable(this._evalValue(str, ctx))
  }
  public evalValueSync (str: string, ctx: Context): any {
    return toValue(this._evalValue(str, ctx))
  }

  public registerFilter (name: string, filter: FilterImplOptions) {
    return Filter.register(name, filter)
  }
  public registerTag (name: string, tag: ITagImplOptions) {
    return Tag.register(name, tag)
  }
  public plugin (plugin: (this: Liquid, L: typeof Liquid) => void) {
    return plugin.call(this, Liquid)
  }
  public express () {
    const self = this // eslint-disable-line
    return function (this: any, filePath: string, ctx: object, cb: (err: Error | null, html?: string) => void) {
      const opts = { root: [...normalizeStringArray(this.root), ...self.options.root] }
      self.renderFile(filePath, ctx, opts).then(html => cb(null, html), cb)
    }
  }

  private lookupError (file: string, roots: string[]) {
    const err = new Error('ENOENT') as any
    err.message = `ENOENT: Failed to lookup "${file}" in "${roots}"`
    err.code = 'ENOENT'
    return err
  }

  /**
   * @deprecated use parseFile instead
   */
  public async getTemplate (file: string, opts?: LiquidOptions): Promise<ITemplate[]> {
    return this.parseFile(file, opts)
  }
  /**
   * @deprecated use parseFileSync instead
   */
  public getTemplateSync (file: string, opts?: LiquidOptions): ITemplate[] {
    return this.parseFileSync(file, opts)
  }
}
