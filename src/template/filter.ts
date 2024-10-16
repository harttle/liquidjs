import { evalToken } from '../render'
import { Context } from '../context'
import { identify, isFunction } from '../util/underscore'
import { FilterHandler, FilterImplOptions } from './filter-impl-options'
import { FilterArg, isKeyValuePair } from '../parser/filter-arg'
import { Liquid } from '../liquid'
import { FilterToken } from '../tokens'

export class Filter {
  public name: string
  public args: FilterArg[]
  public readonly raw: boolean
  private handler: FilterHandler
  private liquid: Liquid
  private token: FilterToken

  public constructor (token: FilterToken, options: FilterImplOptions | undefined, liquid: Liquid) {
    this.token = token
    this.name = token.name
    this.handler = isFunction(options)
      ? options
      : (isFunction(options?.handler) ? options!.handler : identify)
    this.raw = !isFunction(options) && !!options?.raw
    this.args = token.args
    this.liquid = liquid
  }
  public * render (value: any, context: Context): IterableIterator<unknown> {
    const argv: any[] = []
    for (const arg of this.args as FilterArg[]) {
      if (isKeyValuePair(arg)) argv.push([arg[0], yield evalToken(arg[1], context)])
      else argv.push(yield evalToken(arg, context))
    }
    return yield this.handler.apply({ context, token: this.token, liquid: this.liquid }, [value, ...argv])
  }
}
