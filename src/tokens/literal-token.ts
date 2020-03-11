import { Token } from './token'
import { TokenKind } from '../parser/token-kind'

export class LiteralToken extends Token {
  public literal: string
  public constructor (
    public input: string,
    public begin: number,
    public end: number,
    public file?: string
  ) {
    super(TokenKind.Literal, input, begin, end, file)
    this.literal = this.getText()
  }
}
