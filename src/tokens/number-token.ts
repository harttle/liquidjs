import { Token } from './token'
import { TokenKind } from '../parser'

export class NumberToken extends Token {
  public value: number
  constructor (
    public input: string,
    public begin: number,
    public end: number,
    public file?: string
  ) {
    super(TokenKind.Number, input, begin, end, file)
    this.value = Number(this.getText())
  }
}
