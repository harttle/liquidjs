import { Context } from './context'
import { toPromise, toValueSync, isFunction, forOwn } from './util'
import { TagClass, createTagClass, TagImplOptions, FilterImplOptions, Template, Value } from './template'
import { LookupType } from './fs/loader'
import { Render } from './render'
import { Parser } from './parser'
import { tags } from './tags'
import { filters } from './filters'
import { LiquidOptions, normalizeDirectoryList, NormalizedFullOptions, normalize, RenderOptions, RenderFileOptions } from './liquid-options'

export class Liquid {
  public readonly options: NormalizedFullOptions
  public readonly renderer = new Render()
  /**
   * @deprecated will be removed. In tags use `this.parser` instead
   */
  public readonly parser: Parser
  public readonly filters: Record<string, FilterImplOptions> = {}
  public readonly tags: Record<string, TagClass> = {}

  public constructor (opts: LiquidOptions = {}) {
    this.options = normalize(opts)
    // eslint-disable-next-line deprecation/deprecation
    this.parser = new Parser(this)
    forOwn(tags, (conf: TagClass, name: string) => this.registerTag(name, conf))
    forOwn(filters, (handler: FilterImplOptions, name: string) => this.registerFilter(name, handler))
  }
  public parse (html: string, filepath?: string): Template[] {
    const parser = new Parser(this)
    return parser.parse(html, filepath)
  }

  public _render (tpl: Template[], scope: Context | object | undefined, renderOptions: RenderOptions): IterableIterator<any> {
    const ctx = scope instanceof Context ? scope : new Context(scope, this.options, renderOptions)
    return this.renderer.renderTemplates(tpl, ctx)
  }
  public async render (tpl: Template[], scope?: object, renderOptions?: RenderOptions): Promise<any> {
    return toPromise(this._render(tpl, scope, { ...renderOptions, sync: false }))
  }
  public renderSync (tpl: Template[], scope?: object, renderOptions?: RenderOptions): any {
    return toValueSync(this._render(tpl, scope, { ...renderOptions, sync: true }))
  }
  public renderToNodeStream (tpl: Template[], scope?: object, renderOptions: RenderOptions = {}): NodeJS.ReadableStream {
    const ctx = new Context(scope, this.options, renderOptions)
    return this.renderer.renderTemplatesToNodeStream(tpl, ctx)
  }

  public _parseAndRender (html: string, scope: Context | object | undefined, renderOptions: RenderOptions): IterableIterator<any> {
    const tpl = this.parse(html)
    return this._render(tpl, scope, renderOptions)
  }
  public async parseAndRender (html: string, scope?: Context | object, renderOptions?: RenderOptions): Promise<any> {
    return toPromise(this._parseAndRender(html, scope, { ...renderOptions, sync: false }))
  }
  public parseAndRenderSync (html: string, scope?: Context | object, renderOptions?: RenderOptions): any {
    return toValueSync(this._parseAndRender(html, scope, { ...renderOptions, sync: true }))
  }

  public _parsePartialFile (file: string, sync?: boolean, currentFile?: string) {
    return new Parser(this).parseFile(file, sync, LookupType.Partials, currentFile)
  }
  public _parseLayoutFile (file: string, sync?: boolean, currentFile?: string) {
    return new Parser(this).parseFile(file, sync, LookupType.Layouts, currentFile)
  }
  public _parseFile (file: string, sync?: boolean, lookupType?: LookupType, currentFile?: string): Generator<unknown, Template[]> {
    return new Parser(this).parseFile(file, sync, lookupType, currentFile)
  }
  public async parseFile (file: string, lookupType?: LookupType): Promise<Template[]> {
    return toPromise<Template[]>(new Parser(this).parseFile(file, false, lookupType))
  }
  public parseFileSync (file: string, lookupType?: LookupType): Template[] {
    return toValueSync<Template[]>(new Parser(this).parseFile(file, true, lookupType))
  }
  public * _renderFile (file: string, ctx: Context | object | undefined, renderFileOptions: RenderFileOptions): Generator<any> {
    const templates = (yield this._parseFile(file, renderFileOptions.sync, renderFileOptions.lookupType)) as Template[]
    return yield this._render(templates, ctx, renderFileOptions)
  }
  public async renderFile (file: string, ctx?: Context | object, renderFileOptions?: RenderFileOptions) {
    return toPromise(this._renderFile(file, ctx, { ...renderFileOptions, sync: false }))
  }
  public renderFileSync (file: string, ctx?: Context | object, renderFileOptions?: RenderFileOptions) {
    return toValueSync(this._renderFile(file, ctx, { ...renderFileOptions, sync: true }))
  }
  public async renderFileToNodeStream (file: string, scope?: object, renderOptions?: RenderOptions) {
    const templates = await this.parseFile(file)
    return this.renderToNodeStream(templates, scope, renderOptions)
  }

  public _evalValue (str: string, scope?: object | Context): IterableIterator<any> {
    const value = new Value(str, this)
    const ctx = scope instanceof Context ? scope : new Context(scope, this.options)
    return value.value(ctx)
  }
  public async evalValue (str: string, scope?: object | Context): Promise<any> {
    return toPromise(this._evalValue(str, scope))
  }
  public evalValueSync (str: string, scope?: object | Context): any {
    return toValueSync(this._evalValue(str, scope))
  }

  public registerFilter (name: string, filter: FilterImplOptions) {
    this.filters[name] = filter
  }
  public registerTag (name: string, tag: TagClass | TagImplOptions) {
    this.tags[name] = isFunction(tag) ? tag : createTagClass(tag)
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
        const dirs = normalizeDirectoryList(this.root)
        self.options.root.unshift(...dirs)
        self.options.layouts.unshift(...dirs)
        self.options.partials.unshift(...dirs)
      }
      self.renderFile(filePath, ctx).then(html => callback(null, html) as any, callback as any)
    }
  }
}
