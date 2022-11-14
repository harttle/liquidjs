import { Context } from './context/context'
import { forOwn } from './util/underscore'
import { Template } from './template/template'
import { LookupType } from './fs/loader'
import { Render } from './render/render'
import Parser from './parser/parser'
import { TagImplOptions } from './template/tag/tag-impl-options'
import { Value } from './template/value'
import { tags } from './tags'
import { filters } from './filters'
import { TagMap } from './template/tag/tag-map'
import { FilterMap } from './template/filter/filter-map'
import { LiquidOptions, normalizeDirectoryList, NormalizedFullOptions, normalize, RenderOptions } from './liquid-options'
import { FilterImplOptions } from './template/filter/filter-impl-options'
import { toPromise, toValueSync } from './util/async'

export * from './util/error'
export * from './types'
export const version = '[VI]{version}[/VI]'

export class Liquid {
  public readonly options: NormalizedFullOptions
  public readonly renderer: Render
  public readonly parser: Parser
  public readonly filters: FilterMap
  public readonly tags: TagMap

  public constructor (opts: LiquidOptions = {}) {
    this.options = normalize(opts)
    this.parser = new Parser(this)
    this.renderer = new Render()
    this.filters = new FilterMap(this.options.strictFilters, this)
    this.tags = new TagMap()

    forOwn(tags, (conf: TagImplOptions, name: string) => this.registerTag(name, conf))
    forOwn(filters, (handler: FilterImplOptions, name: string) => this.registerFilter(name, handler))
  }
  public parse (html: string, filepath?: string): Template[] {
    return this.parser.parse(html, filepath)
  }

  public _render (tpl: Template[], scope: object | undefined, renderOptions: RenderOptions): IterableIterator<any> {
    const ctx = new Context(scope, this.options, renderOptions)
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

  public _parseAndRender (html: string, scope: object | undefined, renderOptions: RenderOptions): IterableIterator<any> {
    const tpl = this.parse(html)
    return this._render(tpl, scope, renderOptions)
  }
  public async parseAndRender (html: string, scope?: object, renderOptions?: RenderOptions): Promise<any> {
    return toPromise(this._parseAndRender(html, scope, { ...renderOptions, sync: false }))
  }
  public parseAndRenderSync (html: string, scope?: object, renderOptions?: RenderOptions): any {
    return toValueSync(this._parseAndRender(html, scope, { ...renderOptions, sync: true }))
  }

  public _parsePartialFile (file: string, sync?: boolean, currentFile?: string) {
    return this.parser.parseFile(file, sync, LookupType.Partials, currentFile)
  }
  public _parseLayoutFile (file: string, sync?: boolean, currentFile?: string) {
    return this.parser.parseFile(file, sync, LookupType.Layouts, currentFile)
  }
  public async parseFile (file: string): Promise<Template[]> {
    return toPromise<Template[]>(this.parser.parseFile(file, false))
  }
  public parseFileSync (file: string): Template[] {
    return toValueSync<Template[]>(this.parser.parseFile(file, true))
  }
  public async renderFile (file: string, ctx?: object, renderOptions?: RenderOptions) {
    const templates = await this.parseFile(file)
    return this.render(templates, ctx, renderOptions)
  }
  public renderFileSync (file: string, ctx?: object, renderOptions?: RenderOptions) {
    const templates = this.parseFileSync(file)
    return this.renderSync(templates, ctx, renderOptions)
  }
  public async renderFileToNodeStream (file: string, scope?: object, renderOptions?: RenderOptions) {
    const templates = await this.parseFile(file)
    return this.renderToNodeStream(templates, scope, renderOptions)
  }

  public _evalValue (str: string, scopeOrContext?: object | Context): IterableIterator<any> {
    const value = new Value(str, this)
    const ctx = scopeOrContext instanceof Context ? scopeOrContext : new Context(scopeOrContext, this.options)
    return value.value(ctx, false)
  }
  public async evalValue (str: string, scopeOrContext?: object | Context): Promise<any> {
    return toPromise(this._evalValue(str, scopeOrContext))
  }
  public evalValueSync (str: string, scopeOrContext?: object | Context): any {
    return toValueSync(this._evalValue(str, scopeOrContext))
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
        const dirs = normalizeDirectoryList(this.root)
        self.options.root.unshift(...dirs)
        self.options.layouts.unshift(...dirs)
        self.options.partials.unshift(...dirs)
      }
      self.renderFile(filePath, ctx).then(html => callback(null, html) as any, callback as any)
    }
  }
}
