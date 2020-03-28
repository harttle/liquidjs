import { FilterImpl } from './filter-impl'

export interface FilterImplOptions {
  (this: FilterImpl, value: any, ...args: any[]): any;
}
