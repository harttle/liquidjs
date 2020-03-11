import { DelimitedToken } from './delimited-token'
import { BLANK, TYPES, VARIABLE } from '../util/character'
import { TokenizationError } from '../util/error'
import { NormalizedFullOptions } from '../liquid-options'
import { TokenKind } from '../parser/token-kind'

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

    let nameEnd = 0
    while (TYPES[this.content.charCodeAt(nameEnd)] & VARIABLE) nameEnd++
    this.name = this.content.slice(0, nameEnd)
    if (!this.name) throw new TokenizationError(`illegal tag syntax`, this)

    let argsBegin = nameEnd
    while (TYPES[this.content.charCodeAt(argsBegin)] & BLANK) argsBegin++
    this.args = this.content.slice(argsBegin)
  }
}
