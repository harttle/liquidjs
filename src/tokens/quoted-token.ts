import { Token } from './token'
import { TokenKind } from '../parser'
import { parseStringLiteral } from '../render/string'

export class QuotedToken extends Token {
  public readonly content: string
  constructor (
    public input: string,
    public begin: number,
    public end: number,
    public file?: string
  ) {
    super(TokenKind.Quoted, input, begin, end, file)
    this.content = parseStringLiteral(this.getText())
  }
}
