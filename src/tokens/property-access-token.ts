import { Token } from './token'
import { LiteralToken } from './literal-token'
import { ValueToken } from './value-token'
import { RangeToken } from './range-token'
import { QuotedToken } from './quoted-token'
import { TokenKind } from '../parser'

export class PropertyAccessToken extends Token {
  constructor (
    public variable: QuotedToken | RangeToken | LiteralToken | undefined,
    public props: ValueToken[],
    input: string,
    begin: number,
    end: number,
    file?: string
  ) {
    super(TokenKind.PropertyAccess, input, begin, end, file)
  }
}
