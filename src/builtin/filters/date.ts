import strftime from 'src/util/strftime'
import { isString } from 'src/util/underscore'

export default {
  'date': (v, arg) => {
    let date = v
    if (v === 'now') {
      date = new Date()
    } else if (isString(v)) {
      date = new Date(v)
    }
    return isValidDate(date) ? strftime(date, arg) : v
  }
}

function isValidDate (date) {
  return date instanceof Date && !isNaN(date.getTime())
}
