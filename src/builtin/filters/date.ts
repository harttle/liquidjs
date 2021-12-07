import strftime from '../../util/strftime'
import { LiquidDate } from '../../util/liquid-date'
import { isString, isNumber } from '../../util/underscore'
import { FilterImpl } from '../../template/filter/filter-impl'
import { TimezoneDate } from '../../util/timezone-date'

export function date (this: FilterImpl, v: string | Date, arg: string) {
  const opts = this.context.opts
  let date: LiquidDate
  if (v === 'now' || v === 'today') {
    date = new Date()
  } else if (isNumber(v)) {
    date = new Date(v * 1000)
  } else if (isString(v)) {
    if (/^\d+$/.test(v)) {
      date = new Date(+v * 1000)
    } else if (opts.preserveTimezones) {
      date = TimezoneDate.createDateFixedToTimezone(v)
    } else {
      date = new Date(v)
    }
  } else {
    date = v
  }
  if (!isValidDate(date)) return v
  if (opts.hasOwnProperty('timezoneOffset')) {
    date = new TimezoneDate(date, opts.timezoneOffset!)
  }
  return strftime(date, arg)
}

function isValidDate (date: any): date is Date {
  return (date instanceof Date || date instanceof TimezoneDate) && !isNaN(date.getTime())
}
