import { Token } from './token'
import { TokenKind } from '../parser'

export const enum OperatorType {
  Binary,
  Unary
}

export const operatorPrecedences = {
  '==': 2,
  '!=': 2,
  '>': 2,
  '<': 2,
  '>=': 2,
  '<=': 2,
  'contains': 2,
  'not': 1,
  'and': 0,
  'or': 0
}

export const operatorTypes = {
  '==': OperatorType.Binary,
  '!=': OperatorType.Binary,
  '>': OperatorType.Binary,
  '<': OperatorType.Binary,
  '>=': OperatorType.Binary,
  '<=': OperatorType.Binary,
  'contains': OperatorType.Binary,
  'not': OperatorType.Unary,
  'and': OperatorType.Binary,
  'or': OperatorType.Binary
}

export type OperatorKey = keyof typeof operatorPrecedences

export class OperatorToken extends Token {
  public operator: OperatorKey
  public constructor (
    public input: string,
    public begin: number,
    public end: number,
    public file?: string
  ) {
    super(TokenKind.Operator, input, begin, end, file)
    this.operator = this.getText() as OperatorKey
  }
  getPrecedence () {
    return this.operator in operatorPrecedences ? operatorPrecedences[this.operator] : 1
  }
}
