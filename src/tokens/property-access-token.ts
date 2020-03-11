import { Token } from './token'
import { WordToken } from './word-token'
import { QuotedToken } from './quoted-token'
import { TokenKind } from '../parser/token-kind'

export class PropertyAccessToken extends Token {
  constructor (
    public variable: WordToken,
    public props: (WordToken | QuotedToken | PropertyAccessToken)[],
    end: number
  ) {
    super(TokenKind.PropertyAccess, variable.input, variable.begin, end, variable.file)
  }
}
