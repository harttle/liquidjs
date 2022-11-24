import type { Context } from '../context'
import type { Liquid } from '../liquid'

export interface FilterImpl {
  context: Context;
  liquid: Liquid;
}

export interface FilterImplOptions {
  (this: FilterImpl, value: any, ...args: any[]): any;
}
