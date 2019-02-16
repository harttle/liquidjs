import { ParseError } from '../util/error'
import Liquid from 'src/liquid'
import ParseStream from './parse-stream'
import Token from './token'
import Tag from 'src/template/tag/tag'
import HTMLToken from './html-token'
import TagToken from './tag-token'
import OutputToken from './output-token'
import Output from 'src/template/output'
import HTML from 'src/template/html'
import Value from 'src/template/value'

export default class Parser {
  liquid: Liquid

  constructor(liquid: Liquid) {
    this.liquid = liquid
  }
  parse (tokens: Array<Token>) {
    let token
    const templates = []
    while ((token = tokens.shift())) {
      templates.push(this.parseToken(token, tokens))
    }
    return templates
  }
  parseToken (token: Token, remainTokens: Array<Token>) {
    try {
      if (token.type === 'tag') {
        return new Tag(token, remainTokens, this.liquid)
      }
      if (token.type === 'output') {
        return new Output(token, this.liquid.options.strict_filters)
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
