import strftime, { TimezoneDate } from '../../util/strftime'
import { isString, isNumber } from '../../util/underscore'

export function date (v: string | Date, arg: string) {
  let date = v
  if (v === 'now' || v === 'today') {
    date = new Date()
  } else if (isNumber(v)) {
    date = new Date(v * 1000)
  } else if (isString(v)) {
    date = /^\d+$/.test(v) ? new Date(+v * 1000) : new TimezoneDate(v)
  }
  return isValidDate(date) ? strftime(date, arg) : v
}

function isValidDate (date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime())
}
