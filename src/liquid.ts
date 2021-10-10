import { Context } from './context/context'
import { forOwn, snakeCase } from './util/underscore'
import { Template } from './template/template'
import { LookupType } from './fs/loader'
import { Render } from './render/render'
import Parser from './parser/parser'
import { TagImplOptions } from './template/tag/tag-impl-options'
import { Value } from './template/value'
import builtinTags from './builtin/tags'
import * as builtinFilters from './builtin/filters'
import { TagMap } from './template/tag/tag-map'
import { FilterMap } from './template/filter/filter-map'
import { LiquidOptions, normalizeDirectoryList, NormalizedFullOptions, applyDefault, normalize } from './liquid-options'
import { FilterImplOptions } from './template/filter/filter-impl-options'
import { toPromise, toValue } from './util/async'

export * from './util/error'
export * from './types'

export class Liquid {
  public readonly options: NormalizedFullOptions
  public readonly renderer: Render
  public readonly parser: Parser
  public readonly filters: FilterMap
  public readonly tags: TagMap

  public constructor (opts: LiquidOptions = {}) {
    this.options = applyDefault(normalize(opts))
    this.parser = new Parser(this)
    this.renderer = new Render()
    this.filters = new FilterMap(this.options.strictFilters, this)
    this.tags = new TagMap()

    forOwn(builtinTags, (conf: TagImplOptions, name: string) => this.registerTag(snakeCase(name), conf))
    forOwn({...builtinFilters}, (handler: FilterImplOptions, name: string) => this.registerFilter(snakeCase(name), handler))
  }
  public parse (html: string, filepath?: string): Template[] {
    return this.parser.parse(html, filepath)
  }

  public _render (tpl: Template[], scope?: object, sync?: boolean): IterableIterator<any> {
    const ctx = new Context(scope, this.options, sync)
    return this.renderer.renderTemplates(tpl, ctx)
  }
  public async render (tpl: Template[], scope?: object): Promise<any> {
    return toPromise(this._render(tpl, scope, false))
  }
  public renderSync (tpl: Template[], scope?: object): any {
    return toValue(this._render(tpl, scope, true))
  }
  public renderToNodeStream (tpl: Template[], scope?: object): NodeJS.ReadableStream {
    const ctx = new Context(scope, this.options)
    return this.renderer.renderTemplatesToNodeStream(tpl, ctx)
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

  public _parsePartialFile (file: string, sync?: boolean, currentFile?: string) {
    return this.parser.parseFile(file, sync, LookupType.Partials, currentFile)
  }
  public _parseLayoutFile (file: string, sync?: boolean, currentFile?: string) {
    return this.parser.parseFile(file, sync, LookupType.Layouts, currentFile)
  }
  public async parseFile (file: string): Promise<Template[]> {
    return toPromise(this.parser.parseFile(file, false))
  }
  public parseFileSync (file: string): Template[] {
    return toValue(this.parser.parseFile(file, true))
  }
  public async renderFile (file: string, ctx?: object) {
    const templates = await this.parseFile(file)
    return this.render(templates, ctx)
  }
  public renderFileSync (file: string, ctx?: object) {
    const templates = this.parseFileSync(file)
    return this.renderSync(templates, ctx)
  }
  public async renderFileToNodeStream (file: string, scope?: object) {
    const templates = await this.parseFile(file)
    return this.renderToNodeStream(templates, scope)
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
        self.options.root.unshift(...normalizeDirectoryList(this.root))
      }
      self.renderFile(filePath, ctx).then(html => callback(null, html) as any, callback as any)
    }
  }
}
