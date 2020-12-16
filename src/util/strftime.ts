import { changeCase, padStart, padEnd } from './underscore'

const rFormat = /%([-_0^#:]+)?(\d+)?([EO])?(.)/
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]
const dayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
]
const monthNamesShort = monthNames.map(abbr)
const dayNamesShort = dayNames.map(abbr)
const suffixes = {
  1: 'st',
  2: 'nd',
  3: 'rd',
  'default': 'th'
}
interface FormatOptions {
  flags: object;
  width?: string;
  modifier?: string;
}

function abbr (str: string) {
  return str.slice(0, 3)
}

// prototype extensions
function daysInMonth (d: Date) {
  const feb = isLeapYear(d) ? 29 : 28
  return [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
}
function getDayOfYear (d: Date) {
  let num = 0
  for (let i = 0; i < d.getMonth(); ++i) {
    num += daysInMonth(d)[i]
  }
  return num + d.getDate()
}
function getWeekOfYear (d: Date, startDay: number) {
  // Skip to startDay of this week
  const now = getDayOfYear(d) + (startDay - d.getDay())
  // Find the first startDay of the year
  const jan1 = new Date(d.getFullYear(), 0, 1)
  const then = (7 - jan1.getDay() + startDay)
  return String(Math.floor((now - then) / 7) + 1)
}
function isLeapYear (d: Date) {
  const year = d.getFullYear()
  return !!((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)))
}
function getSuffix (d: Date) {
  const str = d.getDate().toString()
  const index = parseInt(str.slice(-1))
  return suffixes[index] || suffixes['default']
}
function century (d: Date) {
  return parseInt(d.getFullYear().toString().substring(0, 2), 10)
}

// default to 0
const padWidths = {
  d: 2,
  e: 2,
  H: 2,
  I: 2,
  j: 3,
  k: 2,
  l: 2,
  L: 3,
  m: 2,
  M: 2,
  S: 2,
  U: 2,
  W: 2
}

// default to '0'
const padChars = {
  a: ' ',
  A: ' ',
  b: ' ',
  B: ' ',
  c: ' ',
  e: ' ',
  k: ' ',
  l: ' ',
  p: ' ',
  P: ' '
}
const formatCodes = {
  a: (d: Date) => dayNamesShort[d.getDay()],
  A: (d: Date) => dayNames[d.getDay()],
  b: (d: Date) => monthNamesShort[d.getMonth()],
  B: (d: Date) => monthNames[d.getMonth()],
  c: (d: Date) => d.toLocaleString(),
  C: (d: Date) => century(d),
  d: (d: Date) => d.getDate(),
  e: (d: Date) => d.getDate(),
  H: (d: Date) => d.getHours(),
  I: (d: Date) => String(d.getHours() % 12 || 12),
  j: (d: Date) => getDayOfYear(d),
  k: (d: Date) => d.getHours(),
  l: (d: Date) => String(d.getHours() % 12 || 12),
  L: (d: Date) => d.getMilliseconds(),
  m: (d: Date) => d.getMonth() + 1,
  M: (d: Date) => d.getMinutes(),
  N: (d: Date, opts: FormatOptions) => {
    const width = Number(opts.width) || 9
    const str = String(d.getMilliseconds()).substr(0, width)
    return padEnd(str, width, '0')
  },
  p: (d: Date) => (d.getHours() < 12 ? 'AM' : 'PM'),
  P: (d: Date) => (d.getHours() < 12 ? 'am' : 'pm'),
  q: (d: Date) => getSuffix(d),
  s: (d: Date) => Math.round(d.valueOf() / 1000),
  S: (d: Date) => d.getSeconds(),
  u: (d: Date) => d.getDay() || 7,
  U: (d: Date) => getWeekOfYear(d, 0),
  w: (d: Date) => d.getDay(),
  W: (d: Date) => getWeekOfYear(d, 1),
  x: (d: Date) => d.toLocaleDateString(),
  X: (d: Date) => d.toLocaleTimeString(),
  y: (d: Date) => d.getFullYear().toString().substring(2, 4),
  Y: (d: Date) => d.getFullYear(),
  z: (d: Date, opts: FormatOptions) => {
    const offset = d.getTimezoneOffset()
    const nOffset = Math.abs(offset)
    const h = Math.floor(nOffset / 60)
    const m = nOffset % 60
    return (offset > 0 ? '-' : '+') +
      padStart(h, 2, '0') +
      (opts.flags[':'] ? ':' : '') +
      padStart(m, 2, '0')
  },
  't': () => '\t',
  'n': () => '\n',
  '%': () => '%'
};
(formatCodes as any).h = formatCodes.b

export default function (inputDate: Date, formatStr: string) {
  let d = inputDate
  if (d instanceof TimezoneDate) {
    d = d.getDisplayDate()
  }

  let output = ''
  let remaining = formatStr
  let match
  while ((match = rFormat.exec(remaining))) {
    output += remaining.slice(0, match.index)
    remaining = remaining.slice(match.index + match[0].length)
    output += format(d, match)
  }
  return output + remaining
}

function format (d: Date, match: RegExpExecArray) {
  const [input, flagStr = '', width, modifier, conversion] = match
  const convert = formatCodes[conversion]
  if (!convert) return input
  const flags = {}
  for (const flag of flagStr) flags[flag] = true
  let ret = String(convert(d, { flags, width, modifier }))
  let padChar = padChars[conversion] || '0'
  let padWidth = width || padWidths[conversion] || 0
  if (flags['^']) ret = ret.toUpperCase()
  else if (flags['#']) ret = changeCase(ret)
  if (flags['_']) padChar = ' '
  else if (flags['0']) padChar = '0'
  if (flags['-']) padWidth = 0
  return padStart(ret, padWidth, padChar)
}

export class TimezoneDate extends Date {
  ISO8601_TIMEZONE_PATTERN = /([zZ]|([+-])(\d{2}):(\d{2}))$/;

  inputTimezoneOffset = 0;

  constructor (public dateString: string) {
    super(dateString)
    const m = dateString.match(this.ISO8601_TIMEZONE_PATTERN)
    if (m && m[1] === 'Z') {
      this.inputTimezoneOffset = this.getTimezoneOffset()
    } else if (m && m[2] && m[3] && m[4]) {
      const [, , sign, hours, minutes] = m
      const delta = (sign === '+' ? 1 : -1) * (parseInt(hours, 10) * 60 + parseInt(minutes, 10))
      this.inputTimezoneOffset = this.getTimezoneOffset() + delta
    }
  }

  getDisplayDate (): Date {
    return new Date((+this) + this.inputTimezoneOffset * 60 * 1000)
  }
}
