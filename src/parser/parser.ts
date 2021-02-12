import { ParseError } from '../util/error'
import { Liquid } from '../liquid'
import { ParseStream } from './parse-stream'
import { isTagToken, isOutputToken } from '../util/type-guards'
import { OutputToken } from '../tokens/output-token'
import { Tag } from '../template/tag/tag'
import { Output } from '../template/output'
import { HTML } from '../template/html'
import { Template } from '../template/template'
import { TopLevelToken } from '../tokens/toplevel-token'

export default class Parser {
  private liquid: Liquid

  public constructor (liquid: Liquid) {
    this.liquid = liquid
  }
  public parse (tokens: TopLevelToken[]) {
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
}
