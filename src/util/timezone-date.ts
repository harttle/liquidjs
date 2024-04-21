import { LiquidDate } from './liquid-date'
import { isString } from './underscore'

// one minute in milliseconds
const OneMinute = 60000
const ISO8601_TIMEZONE_PATTERN = /([zZ]|([+-])(\d{2}):(\d{2}))$/

/**
 * A date implementation with timezone info, just like Ruby date
 *
 * Implementation:
 * - create a Date offset by it's timezone difference, avoiding overriding a bunch of methods
 * - rewrite getTimezoneOffset() to trick strftime
 */
export class TimezoneDate implements LiquidDate {
  private timezoneOffset: number
  private timezoneName: string
  private date: Date
  private displayDate: Date
  constructor (init: string | number | Date | TimezoneDate, timezone: number | string) {
    this.date = init instanceof TimezoneDate
      ? init.date
      : new Date(init)
    this.timezoneOffset = isString(timezone) ? TimezoneDate.getTimezoneOffset(timezone, this.date) : timezone
    this.timezoneName = isString(timezone) ? timezone : ''

    const diff = (this.date.getTimezoneOffset() - this.timezoneOffset) * OneMinute
    const time = this.date.getTime() + diff
    this.displayDate = new Date(time)
  }

  getTime () {
    return this.displayDate.getTime()
  }

  getMilliseconds () {
    return this.displayDate.getMilliseconds()
  }
  getSeconds () {
    return this.displayDate.getSeconds()
  }
  getMinutes () {
    return this.displayDate.getMinutes()
  }
  getHours () {
    return this.displayDate.getHours()
  }
  getDay () {
    return this.displayDate.getDay()
  }
  getDate () {
    return this.displayDate.getDate()
  }
  getMonth () {
    return this.displayDate.getMonth()
  }
  getFullYear () {
    return this.displayDate.getFullYear()
  }
  toLocaleString (locale?: string, init?: any) {
    if (init?.timeZone) {
      return this.date.toLocaleString(locale, init)
    }
    return this.displayDate.toLocaleString(locale, init)
  }
  toLocaleTimeString (locale?: string) {
    return this.displayDate.toLocaleTimeString(locale)
  }
  toLocaleDateString (locale?: string) {
    return this.displayDate.toLocaleDateString(locale)
  }
  getTimezoneOffset () {
    return this.timezoneOffset!
  }
  getTimezoneName () {
    return this.timezoneName
  }

  /**
   * Create a Date object fixed to it's declared Timezone. Both
   * - 2021-08-06T02:29:00.000Z and
   * - 2021-08-06T02:29:00.000+08:00
   * will always be displayed as
   * - 2021-08-06 02:29:00
   * regardless timezoneOffset in JavaScript realm
   *
   * The implementation hack:
   * Instead of calling `.getMonth()`/`.getUTCMonth()` respect to `preserveTimezones`,
   * we create a different Date to trick strftime, it's both simpler and more performant.
   * Given that a template is expected to be parsed fewer times than rendered.
   */
  static createDateFixedToTimezone (dateString: string): LiquidDate {
    const m = dateString.match(ISO8601_TIMEZONE_PATTERN)
    // representing a UTC timestamp
    if (m && m[1] === 'Z') {
      return new TimezoneDate(+new Date(dateString), 0)
    }
    // has a timezone specified
    if (m && m[2] && m[3] && m[4]) {
      const [, , sign, hours, minutes] = m
      const offset = (sign === '+' ? -1 : 1) * (parseInt(hours, 10) * 60 + parseInt(minutes, 10))
      return new TimezoneDate(+new Date(dateString), offset)
    }
    return new Date(dateString)
  }
  private static getTimezoneOffset (timezoneName: string, date = new Date()) {
    const localDateString = date.toLocaleString('en-US', { timeZone: timezoneName })
    const utcDateString = date.toLocaleString('en-US', { timeZone: 'UTC' })

    const localDate = new Date(localDateString)
    const utcDate = new Date(utcDateString)
    return (+utcDate - +localDate) / (60 * 1000)
  }
}
