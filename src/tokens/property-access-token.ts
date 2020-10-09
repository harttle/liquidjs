import { Token } from './token'
import { WordToken } from './word-token'
import { QuotedToken } from './quoted-token'
import { TokenKind } from '../parser/token-kind'
import { parseStringLiteral } from '../parser/parse-string-literal'

export class PropertyAccessToken extends Token {
  constructor (
    public variable: WordToken | QuotedToken,
    public props: (WordToken | QuotedToken | PropertyAccessToken)[],
    end: number
  ) {
    super(TokenKind.PropertyAccess, variable.input, variable.begin, end, variable.file)
  }

  getVariableAsText() {
    if (this.variable instanceof WordToken) {
      return this.variable.getText()
    } else {
      return parseStringLiteral(this.variable.getText())
    }
  }
}
