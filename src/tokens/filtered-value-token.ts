import { Token } from './token'
import { FilterToken } from './filter-token'
import { TokenKind } from '../parser'
import { Expression } from '../render'

/**
 * value expression with optional filters
 * e.g.
 * {% assign foo="bar" | append: "coo" %}
 */
export class FilteredValueToken extends Token {
  constructor (
    public initial: Expression,
    public filters: FilterToken[],
    public input: string,
    public begin: number,
    public end: number,
    public file?: string
  ) {
    super(TokenKind.FilteredValue, input, begin, end, file)
  }
}
