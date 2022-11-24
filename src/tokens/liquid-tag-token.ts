import { DelimitedToken } from './delimited-token'
import { TokenizationError } from '../util'
import { NormalizedFullOptions } from '../liquid-options'
import { Tokenizer, TokenKind } from '../parser'

export class LiquidTagToken extends DelimitedToken {
  public name: string
  public args: string
  public constructor (
    input: string,
    begin: number,
    end: number,
    options: NormalizedFullOptions,
    file?: string
  ) {
    const value = input.slice(begin, end)
    super(TokenKind.Tag, value, input, begin, end, false, false, file)

    if (!/\S/.test(value)) {
      // A line that contains only whitespace.
      this.name = ''
      this.args = ''
    } else {
      const tokenizer = new Tokenizer(this.content, options.operators)
      this.name = tokenizer.readTagName()
      if (!this.name) throw new TokenizationError(`illegal liquid tag syntax`, this)

      tokenizer.skipBlank()
      this.args = tokenizer.remaining()
    }
  }
}
