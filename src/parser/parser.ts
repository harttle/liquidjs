import { ParseError } from '../util/error'
import Liquid from '../liquid'
import ParseStream from './parse-stream'
import Token from './token'
import TagToken from './tag-token'
import OutputToken from './output-token'
import Tag from '../template/tag/tag'
import Output from '../template/output'
import HTML from '../template/html'
import ITemplate from '../template/itemplate'

export default class Parser {
  liquid: Liquid

  constructor (liquid: Liquid) {
    this.liquid = liquid
  }
  parse (tokens: Array<Token>) {
    let token
    const templates: ITemplate[] = []
    while ((token = tokens.shift())) {
      templates.push(this.parseToken(token, tokens))
    }
    return templates
  }
  parseToken (token: Token, remainTokens: Array<Token>) {
    try {
      if (TagToken.is(token)) {
        return new Tag(token, remainTokens, this.liquid)
      }
      if (OutputToken.is(token)) {
        return new Output(token as OutputToken, this.liquid.options.strictFilters)
      }
      return new HTML(token)
    } catch (e) {
      throw new ParseError(e, token)
    }
  }
  parseStream (tokens: Array<Token>) {
    return new ParseStream(tokens, (token, tokens) => this.parseToken(token, tokens))
  }
}
