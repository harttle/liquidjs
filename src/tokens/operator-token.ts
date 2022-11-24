import { Token } from './token'
import { TokenKind } from '../parser'

export const precedence = {
  '==': 1,
  '!=': 1,
  '>': 1,
  '<': 1,
  '>=': 1,
  '<=': 1,
  'contains': 1,
  'and': 0,
  'or': 0
}

export class OperatorToken extends Token {
  public operator: string
  public constructor (
    public input: string,
    public begin: number,
    public end: number,
    public file?: string
  ) {
    super(TokenKind.Operator, input, begin, end, file)
    this.operator = this.getText()
  }
  getPrecedence () {
    const key = this.getText()
    return key in precedence ? precedence[key] : 1
  }
}
