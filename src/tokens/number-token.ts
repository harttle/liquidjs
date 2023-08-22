import { Token } from './token'
import { TokenKind } from '../parser'

export class NumberToken extends Token {
  public content: number
  constructor (
    public input: string,
    public begin: number,
    public end: number,
    public file?: string
  ) {
    super(TokenKind.Number, input, begin, end, file)
    this.content = Number(this.getText())
  }
}
