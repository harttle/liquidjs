import { toValue, stringify, isString, isNumber, TimezoneDate, LiquidDate, strftime } from '../util'
import { FilterImpl } from '../template'

export function date (this: FilterImpl, v: string | Date, format: string, timeZoneOffset?: number) {
  const opts = this.context.opts
  let date: LiquidDate
  v = toValue(v)
  format = stringify(format)
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
  if (timeZoneOffset !== undefined) {
    date = new TimezoneDate(date, timeZoneOffset)
  } else if (opts.timezoneOffset !== undefined) {
    date = new TimezoneDate(date, opts.timezoneOffset!)
  }
  return strftime(date, format)
}

function isValidDate (date: any): date is Date {
  return (date instanceof Date || date instanceof TimezoneDate) && !isNaN(date.getTime())
}
