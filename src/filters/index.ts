import * as htmlFilters from './html'
import * as mathFilters from './math'
import * as urlFilters from './url'
import * as arrayFilters from './array'
import * as dateFilters from './date'
import * as stringFilters from './string'
import { Default, json, raw } from './misc'
import { FilterImplOptions } from '../template'

export const filters: Record<string, FilterImplOptions> = {
  ...htmlFilters,
  ...mathFilters,
  ...urlFilters,
  ...arrayFilters,
  ...dateFilters,
  ...stringFilters,
  json,
  raw,
  default: Default
}
