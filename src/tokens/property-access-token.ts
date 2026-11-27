import { Token } from './token'
import { LiteralToken } from './literal-token'
import { ValueToken } from './value-token'
import { IdentifierToken } from './identifier-token'
import { NumberToken } from './number-token'
import { RangeToken } from './range-token'
import { QuotedToken } from './quoted-token'
import { FilteredValueToken } from './filtered-value-token'
import { TokenKind } from '../parser'
import { Drop } from '../drop/drop'

export class PropertyAccessToken extends Token {
  /**
   * The keys to look up when there's no variable and every prop is a literal, e.g. `a.b[0]`
   */
  public readonly literalPath?: (string | number)[]
  constructor (
    public variable: QuotedToken | RangeToken | LiteralToken | NumberToken | FilteredValueToken | undefined,
    public props: (ValueToken | IdentifierToken)[],
    input: string,
    begin: number,
    end: number,
    file?: string
  ) {
    super(TokenKind.PropertyAccess, input, begin, end, file)
    if (!variable && props.every(prop => 'content' in prop && !(prop.content instanceof Drop))) {
      this.literalPath = props.map(prop => (prop as ValueToken & { content: string | number }).content)
    }
  }
}
