import { Token } from './token'
import { TokenKind } from '../parser'
import { literalValues, LiteralValue } from '../util'

export class LiteralToken extends Token {
  public content: LiteralValue
  public literal: string
  public constructor (
    public input: string,
    public begin: number,
    public end: number,
    public file?: string
  ) {
    super(TokenKind.Literal, input, begin, end, file)
    this.literal = this.getText()
    this.content = literalValues[this.literal]
  }
}
