import { DelimitedToken } from './delimited-token'
import { Token } from './token'
import { TokenizationError } from '../util/error'
import * as lexical from './lexical'
import { NormalizedFullOptions } from '../liquid-options'

export class TagToken extends DelimitedToken {
  public name: string
  public args: string
  public constructor (
    raw: string,
    value: string,
    input: string,
    line: number,
    pos: number,
    options: NormalizedFullOptions,
    file?: string
  ) {
    super(raw, value, input, line, pos, options.trimTagLeft, options.trimTagRight, file)
    this.type = 'tag'
    const match = this.content.match(lexical.tagLine)
    if (!match) {
      throw new TokenizationError(`illegal tag syntax`, this)
    }
    this.name = match[1]
    this.args = match[2]
  }
  public static is (token: Token): token is TagToken {
    return token.type === 'tag'
  }
}
