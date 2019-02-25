import strftime from '../../util/strftime'
import { isString } from '../../util/underscore'

export default {
  'date': (v: string | Date, arg: string) => {
    let date = v
    if (v === 'now') {
      date = new Date()
    } else if (isString(v)) {
      date = new Date(v)
    }
    return isValidDate(date) ? strftime(date, arg) : v
  }
}

function isValidDate (date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime())
}
