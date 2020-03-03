import { Token } from './token'
import { FilterArg } from './filter-arg'

export class FilterToken extends Token {
  public constructor (
    public name: string,
    public args: FilterArg[],
    raw: string,
    input: string,
    line: number,
    col: number,
    file?: string
  ) {
    super(raw, input, line, col, file)
    this.type = 'filter'
  }
}
