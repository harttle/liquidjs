import strftime, { TimezoneDate } from '../../util/strftime'
import { isString, isNumber } from '../../util/underscore'
import { FilterImpl } from '../../template/filter/filter-impl'

export function date (this: FilterImpl, v: string | Date, arg: string) {
  let date = v
  if (v === 'now' || v === 'today') {
    date = new Date()
  } else if (isNumber(v)) {
    date = new Date(v * 1000)
  } else if (isString(v)) {
    if (/^\d+$/.test(v)) {
      date = new Date(+v * 1000)
    } else if (this.context.opts.preserveTimezones) {
      date = new TimezoneDate(v)
    } else {
      date = new Date(v)
    }
  }
  return isValidDate(date) ? strftime(date, arg) : v
}

function isValidDate (date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime())
}
