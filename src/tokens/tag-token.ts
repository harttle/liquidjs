import { DelimitedToken } from './delimited-token'
import { Tokenizer, TokenKind } from '../parser'
import type { NormalizedFullOptions } from '../liquid-options'

export class TagToken extends DelimitedToken {
  public name: string
  public tokenizer: Tokenizer
  public constructor (
    input: string,
    begin: number,
    end: number,
    options: NormalizedFullOptions,
    file?: string
  ) {
    const { trimTagLeft, trimTagRight, tagDelimiterLeft, tagDelimiterRight } = options
    const [valueBegin, valueEnd] = [begin + tagDelimiterLeft.length, end - tagDelimiterRight.length]
    super(TokenKind.Tag, [valueBegin, valueEnd], input, begin, end, trimTagLeft, trimTagRight, file)

    this.tokenizer = new Tokenizer(input, options.operators, file, this.contentRange)
    this.name = this.tokenizer.readTagName()
    this.tokenizer.assert(this.name, `illegal tag syntax, tag name expected`)
    this.tokenizer.assert(this.name !== 'else' || this.contentRange[1] - this.contentRange[0] === 4, () => `unexpected token: ${this.tokenizer.snapshot()}`)
    this.tokenizer.skipBlank()
  }
  get args (): string {
    return this.tokenizer.input.slice(this.tokenizer.p, this.contentRange[1])
  }
}
