import { evalToken } from '../render'
import { Context } from '../context'
import { identify, isFunction, isPromise, isIterator } from '../util/underscore'
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
  /**
   * Returns the result, or a Promise/generator when an argument or the filter itself is async.
   */
  public render (value: any, context: Context): unknown {
    const argv: any[] = [value]
    for (let i = 0; i < this.args.length; i++) {
      const arg = this.evalArg(i, context)
      if (isPromise(arg) || isIterator(arg)) return this.resume(arg, argv, i, context)
      this.pushArg(argv, i, arg)
    }
    return this.handler.apply({ context, token: this.token, liquid: this.liquid }, argv as [any, ...any[]])
  }
  private * resume (pending: unknown, argv: any[], start: number, context: Context): Generator<unknown, unknown, unknown> {
    this.pushArg(argv, start, yield pending)
    for (let i = start + 1; i < this.args.length; i++) {
      this.pushArg(argv, i, yield this.evalArg(i, context))
    }
    return yield this.handler.apply({ context, token: this.token, liquid: this.liquid }, argv as [any, ...any[]])
  }
  private evalArg (i: number, context: Context) {
    const arg = this.args[i]
    return evalToken(isKeyValuePair(arg) ? arg[1] : arg, context)
  }
  private pushArg (argv: any[], i: number, value: unknown) {
    const arg = this.args[i]
    argv.push(isKeyValuePair(arg) ? [arg[0], value] : value)
  }
}
