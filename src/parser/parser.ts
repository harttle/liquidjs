import { toPromise, assert, isTagToken, isOutputToken, ParseError } from '../util'
import { Tokenizer } from './tokenizer'
import { ParseStream } from './parse-stream'
import { TopLevelToken, OutputToken } from '../tokens'
import { Template, Output, HTML } from '../template'
import { LiquidCache } from '../cache'
import { FS, Loader, LookupType } from '../fs'
import type { Liquid } from '../liquid'

export class Parser {
  public parseFile: (file: string, sync?: boolean, type?: LookupType, currentFile?: string) => Generator<unknown, Template[], Template[] | string>

  private liquid: Liquid
  private fs: FS
  private cache?: LiquidCache
  private loader: Loader

  public constructor (liquid: Liquid) {
    this.liquid = liquid
    this.cache = this.liquid.options.cache
    this.fs = this.liquid.options.fs
    this.parseFile = this.cache ? this._parseFileCached : this._parseFile
    this.loader = new Loader(this.liquid.options)
  }
  public parse (html: string, filepath?: string): Template[] {
    const tokenizer = new Tokenizer(html, this.liquid.options.operators, filepath)
    const tokens = tokenizer.readTopLevelTokens(this.liquid.options)
    return this.parseTokens(tokens)
  }
  public parseTokens (tokens: TopLevelToken[]) {
    let token
    const templates: Template[] = []
    while ((token = tokens.shift())) {
      templates.push(this.parseToken(token, tokens))
    }
    return templates
  }
  public parseToken (token: TopLevelToken, remainTokens: TopLevelToken[]) {
    try {
      if (isTagToken(token)) {
        const TagClass = this.liquid.tags[token.name]
        assert(TagClass, `tag "${token.name}" not found`)
        return new TagClass(token, remainTokens, this.liquid)
      }
      if (isOutputToken(token)) {
        return new Output(token as OutputToken, this.liquid)
      }
      return new HTML(token)
    } catch (e) {
      throw new ParseError(e as Error, token)
    }
  }
  public parseStream (tokens: TopLevelToken[]) {
    return new ParseStream(tokens, (token, tokens) => this.parseToken(token, tokens))
  }
  private * _parseFileCached (file: string, sync?: boolean, type: LookupType = LookupType.Root, currentFile?: string): Generator<unknown, Template[], Template[]> {
    const cache = this.cache!
    const key = this.loader.shouldLoadRelative(file) ? currentFile + ',' + file : type + ':' + file
    const tpls = yield cache.read(key)
    if (tpls) return tpls

    const task = this._parseFile(file, sync, type, currentFile)
    // sync mode: exec the task and cache the result
    // async mode: cache the task before exec
    const taskOrTpl = sync ? yield task : toPromise(task)
    cache.write(key, taskOrTpl as any)
    // note: concurrent tasks will be reused, cache for failed task is removed until its end
    try { return yield taskOrTpl } catch (err) { cache.remove(key); throw err }
  }
  private * _parseFile (file: string, sync?: boolean, type: LookupType = LookupType.Root, currentFile?: string): Generator<unknown, Template[], string> {
    const filepath = yield this.loader.lookup(file, type, sync, currentFile)
    return this.liquid.parse(sync ? this.fs.readFileSync(filepath) : yield this.fs.readFile(filepath), filepath)
  }
}
