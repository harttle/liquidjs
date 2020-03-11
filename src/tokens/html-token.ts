import { Token } from './token'
import { TokenKind } from '../parser/token-kind'

export class HTMLToken extends Token {
  trimLeft = 0
  trimRight = 0
  constructor (
    public input: string,
    public begin: number,
    public end: number,
    public file?: string
  ) {
    super(TokenKind.HTML, input, begin, end, file)
  }
  public getContent () {
    return this.input.slice(this.begin + this.trimLeft, this.end - this.trimRight)
  }
}
