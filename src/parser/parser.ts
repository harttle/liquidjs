import { ParseError } from '../util/error'
import { Liquid } from '../liquid'
import { ParseStream } from './parse-stream'
import { Token } from './token'
import { TagToken } from './tag-token'
import { OutputToken } from './output-token'
import { Tag } from '../template/tag/tag'
import { Output } from '../template/output'
import { HTML } from '../template/html'
import { Template } from '../template/template'

export default class Parser {
  private liquid: Liquid

  public constructor (liquid: Liquid) {
    this.liquid = liquid
  }
  public parse (tokens: Token[]) {
    let token
    const templates: Template[] = []
    while ((token = tokens.shift())) {
      templates.push(this.parseToken(token, tokens))
    }
    return templates
  }
  public parseToken (token: Token, remainTokens: Token[]) {
    try {
      if (TagToken.is(token)) {
        return new Tag(token, remainTokens, this.liquid)
      }
      if (OutputToken.is(token)) {
        return new Output(token as OutputToken, this.liquid.filters)
      }
      return new HTML(token)
    } catch (e) {
      throw new ParseError(e, token)
    }
  }
  public parseStream (tokens: Token[]) {
    return new ParseStream(tokens, (token, tokens) => this.parseToken(token, tokens))
  }
}
