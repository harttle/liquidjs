// one minute in milliseconds
const OneMinute = 60000
const hostTimezoneOffset = new Date().getTimezoneOffset()
const ISO8601_TIMEZONE_PATTERN = /([zZ]|([+-])(\d{2}):(\d{2}))$/

/**
 * A date implementation with timezone info, just like Ruby date
 *
 * Implementation:
 * - create a Date offset by it's timezone difference, avoiding overriding a bunch of methods
 * - rewrite getTimezoneOffset() to trick strftime
 */
export class TimezoneDate extends Date {
  private timezoneOffset?: number
  constructor (init: string | number | Date, timezoneOffset: number) {
    if (init instanceof TimezoneDate) return init
    const diff = (hostTimezoneOffset - timezoneOffset) * OneMinute
    const time = new Date(init).getTime() + diff
    super(time)
    this.timezoneOffset = timezoneOffset
  }
  getTimezoneOffset () {
    return this.timezoneOffset!
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
  static createDateFixedToTimezone (dateString: string) {
    const m = dateString.match(ISO8601_TIMEZONE_PATTERN)
    // representing a UTC timestamp
    if (m && m[1] === 'Z') {
      return new TimezoneDate(+new Date(dateString), 0)
    }
    // has a timezone specified
    if (m && m[2] && m[3] && m[4]) {
      const [, , sign, hours, minutes] = m
      const delta = (sign === '+' ? -1 : 1) * (parseInt(hours, 10) * 60 + parseInt(minutes, 10))
      return new TimezoneDate(+new Date(dateString), delta)
    }
    return new Date(dateString)
  }
}
