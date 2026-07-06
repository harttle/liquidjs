import { Token } from './token'
import { TokenKind } from '../parser'
import { literalValues, LiteralValue, LiteralKey } from '../util'

export class LiteralToken extends Token {
  public content: LiteralValue
  public literal: LiteralKey
  public constructor (
    public input: string,
    public begin: number,
    public end: number,
    public file?: string
  ) {
    super(TokenKind.Literal, input, begin, end, file)
    this.literal = this.getText() as LiteralKey
    this.content = literalValues[this.literal]
  }
}
