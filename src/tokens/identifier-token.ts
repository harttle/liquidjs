import { Token } from './token'
import { TokenKind } from '../parser'

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
}
