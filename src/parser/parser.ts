import { ParseError } from '../util/error'
import { Liquid, Tokenizer } from '../liquid'
import { ParseStream } from './parse-stream'
import { isTagToken, isOutputToken } from '../util/type-guards'
import { OutputToken } from '../tokens/output-token'
import { Tag } from '../template/tag/tag'
import { Output } from '../template/output'
import { HTML } from '../template/html'
import { Template } from '../template/template'
import { TopLevelToken } from '../tokens/toplevel-token'
import { Cache } from '../cache/cache'
import { Loader, LookupType } from '../fs/loader'
import { FS } from '../fs/fs'

export default class Parser {
  public parseFile: (file: string, sync?: boolean, type?: LookupType, currentFile?: string) => Iterator<Template[]>

  private liquid: Liquid
  private fs: FS
  private cache: Cache<Template[]> | undefined
  private loader: Loader

  public constructor (liquid: Liquid) {
    this.liquid = liquid
    this.cache = this.liquid.options.cache
    this.fs = this.liquid.options.fs
    this.parseFile = this.cache ? this._parseFileCached : this._parseFile
    this.loader = new Loader(this.liquid.options)
  }
  public parse (html: string, filepath?: string): Template[] {
    const tokenizer = new Tokenizer(html, this.liquid.options.operatorsTrie, filepath)
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
        return new Tag(token, remainTokens, this.liquid)
      }
      if (isOutputToken(token)) {
        return new Output(token as OutputToken, this.liquid)
      }
      return new HTML(token)
    } catch (e) {
      throw new ParseError(e, token)
    }
  }
  public parseStream (tokens: TopLevelToken[]) {
    return new ParseStream(tokens, (token, tokens) => this.parseToken(token, tokens))
  }
  private * _parseFileCached (file: string, sync?: boolean, type: LookupType = LookupType.Root, currentFile?: string) {
    const key = this.loader.shouldLoadRelative(file)
      ? currentFile + ',' + file
      : type + ':' + file
    let templates = yield this.cache!.read(key)
    if (templates) return templates

    templates = yield this._parseFile(file, sync, type, currentFile)
    this.cache!.write(key, templates)
    return templates
  }
  private * _parseFile (file: string, sync?: boolean, type: LookupType = LookupType.Root, currentFile?: string) {
    const filepath = yield this.loader.lookup(file, type, sync, currentFile)
    return this.liquid.parse(sync ? this.fs.readFileSync(filepath) : yield this.fs.readFile(filepath), filepath)
  }
}
