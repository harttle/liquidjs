import { Context } from './context/context'
import { forOwn, snakeCase } from './util/underscore'
import { Template } from './template/template'
import { Tokenizer } from './parser/tokenizer'
import { Render } from './render/render'
import Parser from './parser/parser'
import { TagImplOptions } from './template/tag/tag-impl-options'
import { Value } from './template/value'
import builtinTags from './builtin/tags'
import * as builtinFilters from './builtin/filters'
import { TagMap } from './template/tag/tag-map'
import { FilterMap } from './template/filter/filter-map'
import { LiquidOptions, normalizeStringArray, NormalizedFullOptions, applyDefault, normalize } from './liquid-options'
import { FilterImplOptions } from './template/filter/filter-impl-options'
import { toPromise, toValue } from './util/async'
import { Emitter } from './render/emitter'

export * from './util/error'
export * from './types'

export class Liquid {
  public options: NormalizedFullOptions
  public renderer: Render
  public parser: Parser
  public filters: FilterMap
  public tags: TagMap
  public parseFileImpl: (file: string, sync?: boolean) => Iterator<Template[]>

  public constructor (opts: LiquidOptions = {}) {
    this.options = applyDefault(normalize(opts))
    this.parser = new Parser(this)
    this.renderer = new Render()
    this.filters = new FilterMap(this.options.strictFilters, this)
    this.tags = new TagMap()
    this.parseFileImpl = this.options.cache ? this._parseFileCached : this._parseFile

    forOwn(builtinTags, (conf: TagImplOptions, name: string) => this.registerTag(snakeCase(name), conf))
    forOwn(builtinFilters, (handler: FilterImplOptions, name: string) => this.registerFilter(snakeCase(name), handler))
  }
  public parse (html: string, filepath?: string): Template[] {
    const tokenizer = new Tokenizer(html, this.options.operatorsTrie, filepath)
    const tokens = tokenizer.readTopLevelTokens(this.options)
    return this.parser.parse(tokens)
  }

  public _render (tpl: Template[], scope?: object, sync?: boolean): IterableIterator<any> {
    const ctx = new Context(scope, this.options, sync)
    const emitter = new Emitter(this.options.keepOutputType)
    return this.renderer.renderTemplates(tpl, ctx, emitter)
  }
  public async render (tpl: Template[], scope?: object): Promise<any> {
    return toPromise(this._render(tpl, scope, false))
  }
  public renderSync (tpl: Template[], scope?: object): any {
    return toValue(this._render(tpl, scope, true))
  }

  public _parseAndRender (html: string, scope?: object, sync?: boolean): IterableIterator<any> {
    const tpl = this.parse(html)
    return this._render(tpl, scope, sync)
  }
  public async parseAndRender (html: string, scope?: object): Promise<any> {
    return toPromise(this._parseAndRender(html, scope, false))
  }
  public parseAndRenderSync (html: string, scope?: object): any {
    return toValue(this._parseAndRender(html, scope, true))
  }

  private * _parseFileCached (file: string, sync?: boolean) {
    const cache = this.options.cache!
    let tpls = yield cache.read(file)
    if (tpls) return tpls

    tpls = yield this._parseFile(file, sync)
    cache.write(file, tpls)
    return tpls
  }
  private * _parseFile (file: string, sync?: boolean) {
    const { fs, root } = this.options

    for (const filepath of this.lookupFiles(file, this.options)) {
      if (!(sync ? fs.existsSync(filepath) : yield fs.exists(filepath))) continue
      const tpl = this.parse(sync ? fs.readFileSync(filepath) : yield fs.readFile(filepath), filepath)
      return tpl
    }
    throw this.lookupError(file, root)
  }
  public async parseFile (file: string): Promise<Template[]> {
    return toPromise(this.parseFileImpl(file, false))
  }
  public parseFileSync (file: string): Template[] {
    return toValue(this.parseFileImpl(file, true))
  }
  public async renderFile (file: string, ctx?: object) {
    const templates = await this.parseFile(file)
    return this.render(templates, ctx)
  }
  public renderFileSync (file: string, ctx?: object) {
    const templates = this.parseFileSync(file)
    return this.renderSync(templates, ctx)
  }

  public _evalValue (str: string, ctx: Context): IterableIterator<any> {
    const value = new Value(str, this)
    return value.value(ctx, false)
  }
  public async evalValue (str: string, ctx: Context): Promise<any> {
    return toPromise(this._evalValue(str, ctx))
  }
  public evalValueSync (str: string, ctx: Context): any {
    return toValue(this._evalValue(str, ctx))
  }

  public registerFilter (name: string, filter: FilterImplOptions) {
    this.filters.set(name, filter)
  }
  public registerTag (name: string, tag: TagImplOptions) {
    this.tags.set(name, tag)
  }
  public plugin (plugin: (this: Liquid, L: typeof Liquid) => void) {
    return plugin.call(this, Liquid)
  }
  public express () {
    const self = this // eslint-disable-line
    let firstCall = true

    return function (this: any, filePath: string, ctx: object, callback: (err: Error | null, rendered: string) => void) {
      if (firstCall) {
        firstCall = false
        self.options.root.unshift(...normalizeStringArray(this.root))
      }
      self.renderFile(filePath, ctx).then(html => callback(null, html) as any, callback as any)
    }
  }

  private * lookupFiles (file: string, options: NormalizedFullOptions) {
    const { root, fs, extname } = options
    for (const dir of root) {
      yield fs.resolve(dir, file, extname)
    }
    if (fs.fallback !== undefined) {
      const filepath = fs.fallback(file)
      if (filepath !== undefined) yield filepath
    }
  }

  private lookupError (file: string, roots: string[]) {
    const err = new Error('ENOENT') as any
    err.message = `ENOENT: Failed to lookup "${file}" in "${roots}"`
    err.code = 'ENOENT'
    return err
  }
}
