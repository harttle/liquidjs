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

type GetTemplateResult = ITemplate[] | undefined

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
  public render (tpl: ITemplate[], scope?: object, opts?: LiquidOptions): Promise<string> {
    const options = { ...this.options, ...normalize(opts) }
    const ctx = new Context(scope, options)
    return this.renderer.renderTemplates(tpl, ctx)
  }
  public renderSync (tpl: ITemplate[], scope?: object, opts?: LiquidOptions): string {
    const options = { ...this.options, ...normalize(opts) }
    const ctx = new Context(scope, options, true)
    return this.renderer.renderTemplatesSync(tpl, ctx)
  }
  public async parseAndRender (html: string, scope?: object, opts?: LiquidOptions): Promise<string> {
    const tpl = this.parse(html)
    return this.render(tpl, scope, opts)
  }
  public parseAndRenderSync (html: string, scope?: object, opts?: LiquidOptions): string {
    const tpl = this.parse(html)
    return this.renderSync(tpl, scope, opts)
  }
  public getTemplateSync (file: string, opts?: LiquidOptions): ITemplate[] {
    const options = { ...this.options, ...normalize(opts) }
    const paths = options.root.map(root => this.fs.resolve(root, file, options.extname))

    for (const filepath of paths) {
      const tpl = this.respectCache(filepath, () => {
        if (!(this.fs.existsSync(filepath))) return
        return this.parse(this.fs.readFileSync(filepath), filepath)
      })
      if (tpl) return tpl
    }

    throw this.lookupError(file, options.root)
  }
  public async getTemplate (file: string, opts?: LiquidOptions): Promise<ITemplate[]> {
    const options = { ...this.options, ...normalize(opts) }
    const paths = options.root.map(root => this.fs.resolve(root, file, options.extname))

    for (const filepath of paths) {
      const tpl = await this.respectCache(filepath, async () => {
        if (!(await this.fs.exists(filepath))) return
        return this.parse(await this.fs.readFile(filepath), filepath)
      })
      if (tpl !== undefined) return tpl
    }
    throw this.lookupError(file, options.root)
  }
  public async renderFile (file: string, ctx?: object, opts?: LiquidOptions) {
    const templates = await this.getTemplate(file, opts)
    return this.render(templates, ctx, opts)
  }
  public renderFileSync (file: string, ctx?: object, opts?: LiquidOptions) {
    const options = normalize(opts)
    const templates = this.getTemplateSync(file, options)
    return this.renderSync(templates, ctx, opts)
  }
  public async evalValue (str: string, ctx: Context): Promise<any> {
    return new Value(str, this.options.strictFilters).value(ctx)
  }

  public evalValueSync (str: string, ctx: Context): any {
    return new Value(str, this.options.strictFilters).valueSync(ctx)
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

  private setCache<T extends GetTemplateResult> (filepath: string, tpl: T): T {
    if (tpl === undefined) return tpl
    this.cache[filepath] = tpl
    return tpl
  }

  private respectCache (filepath: string, resolver: () => GetTemplateResult): GetTemplateResult
  private respectCache (filepath: string, resolver: () => Promise<GetTemplateResult>): Promise<GetTemplateResult>
  private respectCache (filepath: string, resolver: () => GetTemplateResult | Promise<GetTemplateResult>): GetTemplateResult | Promise<GetTemplateResult> {
    if (!this.options.cache) return resolver()
    if (this.cache[filepath]) return this.cache[filepath]
    const tpl = resolver()
    if (tpl instanceof Promise) {
      return tpl.then(c => this.setCache(filepath, c))
    }
    return this.setCache(filepath, tpl)
  }
}