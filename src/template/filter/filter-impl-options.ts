import { FilterImpl } from './filter-impl'

export type FilterImplOptions = (this: FilterImpl, value: any, ...args: any[]) => any
