import { Token } from './token'
import { WordToken } from './word-token'
import { TokenKind } from '../parser/token-kind'

export class NumberToken extends Token {
  constructor (
    public whole: WordToken,
    public decimal?: WordToken
  ) {
    super(TokenKind.Number, whole.input, whole.begin, decimal ? decimal.end : whole.end, whole.file)
  }
}
