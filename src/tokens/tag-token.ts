import { DelimitedToken } from './delimited-token'
import { TokenizationError } from '../util/error'
import { Tokenizer, TokenKind } from '../parser'
import type { NormalizedFullOptions } from '../liquid-options'

export class TagToken extends DelimitedToken {
  public name: string
  public args: string
  public constructor (
    input: string,
    begin: number,
    end: number,
    options: NormalizedFullOptions,
    file?: string
  ) {
    const { trimTagLeft, trimTagRight, tagDelimiterLeft, tagDelimiterRight } = options
    const value = input.slice(begin + tagDelimiterLeft.length, end - tagDelimiterRight.length)
    super(TokenKind.Tag, value, input, begin, end, trimTagLeft, trimTagRight, file)

    const tokenizer = new Tokenizer(this.content, options.operators)
    this.name = tokenizer.readTagName()
    if (!this.name) throw new TokenizationError(`illegal tag syntax`, this)

    tokenizer.skipBlank()
    this.args = tokenizer.remaining()
  }
}
