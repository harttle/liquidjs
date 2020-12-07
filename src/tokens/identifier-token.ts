import { Token } from './token'
import { NUMBER, TYPES, SIGN } from '../util/character'
import { TokenKind } from '../parser/token-kind'

export class IdentifierToken extends Token {
  public content: string
  constructor (
    public input: string,
    public begin: number,
    public end: number,
    public file?: string
  ) {
    super(TokenKind.Word, input, begin, end, file)
    this.content = this.getText()
  }
  isNumber (allowSign = false) {
    const begin = allowSign && TYPES[this.input.charCodeAt(this.begin)] & SIGN
      ? this.begin + 1
      : this.begin
    for (let i = begin; i < this.end; i++) {
      if (!(TYPES[this.input.charCodeAt(i)] & NUMBER)) return false
    }
    return true
  }
}
