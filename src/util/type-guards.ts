import { OperatorToken } from '../tokens/operator-token'
import { DelimitedToken } from '../tokens/delimited-token'
import { IdentifierToken } from '../tokens/identifier-token'
import { TagToken } from '../tokens/tag-token'
import { HTMLToken } from '../tokens/html-token'
import { OutputToken } from '../tokens/output-token'
import { PropertyAccessToken } from '../tokens/property-access-token'
import { LiteralToken } from '../tokens/literal-token'
import { QuotedToken } from '../tokens/quoted-token'
import { NumberToken } from '../tokens/number-token'
import { RangeToken } from '../tokens/range-token'
import { TokenKind } from '../parser/token-kind'

export function isDelimitedToken (val: any): val is DelimitedToken {
  return !!(getKind(val) & TokenKind.Delimited)
}

export function isOperatorToken (val: any): val is OperatorToken {
  return getKind(val) === TokenKind.Operator
}

export function isHTMLToken (val: any): val is HTMLToken {
  return getKind(val) === TokenKind.HTML
}

export function isOutputToken (val: any): val is OutputToken {
  return getKind(val) === TokenKind.Output
}

export function isTagToken (val: any): val is TagToken {
  return getKind(val) === TokenKind.Tag
}

export function isQuotedToken (val: any): val is QuotedToken {
  return getKind(val) === TokenKind.Quoted
}

export function isLiteralToken (val: any): val is LiteralToken {
  return getKind(val) === TokenKind.Literal
}

export function isNumberToken (val: any): val is NumberToken {
  return getKind(val) === TokenKind.Number
}

export function isPropertyAccessToken (val: any): val is PropertyAccessToken {
  return getKind(val) === TokenKind.PropertyAccess
}

export function isWordToken (val: any): val is IdentifierToken {
  return getKind(val) === TokenKind.Word
}

export function isRangeToken (val: any): val is RangeToken {
  return getKind(val) === TokenKind.Range
}

function getKind (val: any) {
  return val ? val.kind : -1
}
