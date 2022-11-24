import { Token } from './token'
import { FilterArg } from '../parser/filter-arg'
import { TokenKind } from '../parser'

export class FilterToken extends Token {
  public constructor (
    public name: string,
    public args: FilterArg[],
    input: string,
    begin: number,
    end: number,
    file?: string
  ) {
    super(TokenKind.Filter, input, begin, end, file)
  }
}
