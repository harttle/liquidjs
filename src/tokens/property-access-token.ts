import { Token } from './token'
import { IdentifierToken } from './identifier-token'
import { QuotedToken } from './quoted-token'
import { TokenKind, parseStringLiteral } from '../parser'

export class PropertyAccessToken extends Token {
  public propertyName: string
  constructor (
    public variable: IdentifierToken | QuotedToken,
    public props: (IdentifierToken | QuotedToken | PropertyAccessToken)[],
    end: number
  ) {
    super(TokenKind.PropertyAccess, variable.input, variable.begin, end, variable.file)
    this.propertyName = this.variable instanceof IdentifierToken
      ? this.variable.getText()
      : parseStringLiteral(this.variable.getText())
  }
}
