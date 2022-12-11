import type { Context } from '../context'
import type { Liquid } from '../liquid'

export interface FilterImpl {
  context: Context;
  liquid: Liquid;
}

export type FilterHandler = (this: FilterImpl, value: any, ...args: any[]) => any;

export interface FilterOptions {
  handler: FilterHandler;
  raw: boolean;
}

export type FilterImplOptions = FilterHandler | FilterOptions
