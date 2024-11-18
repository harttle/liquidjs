import { DelimitedToken } from './delimited-token'
import { NormalizedFullOptions } from '../liquid-options'
import { Tokenizer, TokenKind } from '../parser'

/**
 * LiquidTagToken is different from TagToken by not having delimiters `{%` or `%}`
 */
export class LiquidTagToken extends DelimitedToken {
  public name: string
  public args: string
  public tokenizer: Tokenizer
  public constructor (
    input: string,
    begin: number,
    end: number,
    options: NormalizedFullOptions,
    file?: string
  ) {
    super(TokenKind.Tag, [begin, end], input, begin, end, false, false, file)
    this.tokenizer = new Tokenizer(input, options.operators, file, this.contentRange)
    this.name = this.tokenizer.readTagName()
    this.tokenizer.assert(this.name, 'illegal liquid tag syntax')
    this.tokenizer.skipBlank()
    this.args = this.tokenizer.remaining()
  }

  public argsRange (): [number, number] {
    return [this.tokenizer.p, this.contentRange[1]]
  }
}
