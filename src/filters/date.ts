import { toValue, stringify, isString, isNumber, LiquidDate, strftime, isNil } from '../util'
import { FilterImpl } from '../template'
import { NormalizedFullOptions } from '../liquid-options'

export function date (this: FilterImpl, v: string | Date, format?: string, timezoneOffset?: number | string) {
  const size = ((v as string)?.length ?? 0) + (format?.length ?? 0) + ((timezoneOffset as string)?.length ?? 0)
  this.context.memoryLimit.use(size)
  const date = parseDate(v, this.context.opts, timezoneOffset)
  if (!date) return v
  format = toValue(format)
  format = isNil(format) ? this.context.opts.dateFormat : stringify(format)
  return strftime(date, format)
}

export function date_to_xmlschema (this: FilterImpl, v: string | Date) {
  return date.call(this, v, '%Y-%m-%dT%H:%M:%S%:z')
}

export function date_to_rfc822 (this: FilterImpl, v: string | Date) {
  return date.call(this, v, '%a, %d %b %Y %H:%M:%S %z')
}

export function date_to_string (this: FilterImpl, v: string | Date, type?: string, style?: string) {
  return stringify_date.call(this, v, '%b', type, style)
}

export function date_to_long_string (this: FilterImpl, v: string | Date, type?: string, style?: string) {
  return stringify_date.call(this, v, '%B', type, style)
}

function stringify_date (this: FilterImpl, v: string | Date, month_type: string, type?: string, style?: string) {
  const date = parseDate(v, this.context.opts)
  if (!date) return v
  if (type === 'ordinal') {
    const d = date.getDate()
    return style === 'US'
      ? strftime(date, `${month_type} ${d}%q, %Y`)
      : strftime(date, `${d}%q ${month_type} %Y`)
  }
  return strftime(date, `%d ${month_type} %Y`)
}

function parseDate (v: string | Date, opts: NormalizedFullOptions, timezoneOffset?: number | string): LiquidDate | undefined {
  let date: LiquidDate | undefined
  const defaultTimezoneOffset = timezoneOffset ?? opts.timezoneOffset
  const locale = opts.locale
  v = toValue(v)
  if (v === 'now' || v === 'today') {
    date = new LiquidDate(Date.now(), locale, defaultTimezoneOffset)
  } else if (isNumber(v)) {
    date = new LiquidDate(v * 1000, locale, defaultTimezoneOffset)
  } else if (isString(v)) {
    if (/^\d+$/.test(v)) {
      date = new LiquidDate(+v * 1000, locale, defaultTimezoneOffset)
    } else if (opts.preserveTimezones && timezoneOffset === undefined) {
      date = LiquidDate.createDateFixedToTimezone(v, locale)
    } else {
      date = new LiquidDate(v, locale, defaultTimezoneOffset)
    }
  } else {
    date = new LiquidDate(v, locale, defaultTimezoneOffset)
  }
  return date.valid() ? date : undefined
}
