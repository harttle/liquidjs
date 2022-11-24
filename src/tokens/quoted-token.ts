import { Token } from './token'
import { TokenKind } from '../parser'

export class QuotedToken extends Token {
  constructor (
    public input: string,
    public begin: number,
    public end: number,
    public file?: string
  ) {
    super(TokenKind.Quoted, input, begin, end, file)
  }
}
