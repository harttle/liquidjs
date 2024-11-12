import { RangeToken, NumberToken, QuotedToken, LiteralToken, PropertyAccessToken, OutputToken, HTMLToken, TagToken, IdentifierToken, DelimitedToken, OperatorToken, ValueToken } from '../tokens'
import { TokenKind } from '../parser'

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

export function isValueToken (val: any): val is ValueToken {
  // valueTokenBitMask = TokenKind.Number | TokenKind.Literal | TokenKind.Quoted | TokenKind.PropertyAccess | TokenKind.Range
  return (getKind(val) & 1667) > 0
}

function getKind (val: any) {
  return val ? val.kind : -1
}
