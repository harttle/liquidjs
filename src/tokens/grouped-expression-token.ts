import { Token } from './token'
import { FilterToken } from './filter-token'
import { TokenKind } from '../parser'
import { Expression } from '../render'
import type { Filter } from '../template/filter'

export class GroupedExpressionToken extends Token {
  public resolvedFilters?: Filter[]
  constructor (
    public initial: Expression,
    public filters: FilterToken[],
    public input: string,
    public begin: number,
    public end: number,
    public file?: string
  ) {
    super(TokenKind.GroupedExpression, input, begin, end, file)
  }
}
