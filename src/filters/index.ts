import * as htmlFilters from './html'
import * as mathFilters from './math'
import * as urlFilters from './url'
import * as arrayFilters from './array'
import * as dateFilters from './date'
import * as stringFilters from './string'
import * as base64Filters from './base64'
import misc from './misc'
import { FilterImplOptions } from '../template'

export const filters: Record<string, FilterImplOptions> = {
  ...htmlFilters,
  ...mathFilters,
  ...urlFilters,
  ...arrayFilters,
  ...dateFilters,
  ...stringFilters,
  ...base64Filters,
  ...misc
}
