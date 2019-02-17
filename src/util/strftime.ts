import { padStart } from './underscore'

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

function abbr (str) {
  return str.slice(0, 3)
}

// prototype extensions
const _date = {
  daysInMonth: function (d) {
    const feb = _date.isLeapYear(d) ? 29 : 28
    return [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  },

  getDayOfYear: function (d) {
    let num = 0
    for (let i = 0; i < d.getMonth(); ++i) {
      num += _date.daysInMonth(d)[i]
    }
    return num + d.getDate()
  },

  // Startday is an integer of which day to start the week measuring from
  // TODO: that comment was retarted. fix it.
  getWeekOfYear: function (d, startDay) {
    // Skip to startDay of this week
    const now = this.getDayOfYear(d) + (startDay - d.getDay())
    // Find the first startDay of the year
    const jan1 = new Date(d.getFullYear(), 0, 1)
    const then = (7 - jan1.getDay() + startDay)
    return padStart(String(Math.floor((now - then) / 7) + 1), 2, '0')
  },

  isLeapYear: function (d) {
    const year = d.getFullYear()
    return !!((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)))
  },

  getSuffix: function (d) {
    const str = d.getDate().toString()
    const index = parseInt(str.slice(-1))
    return suffixes[index] || suffixes['default']
  },

  century: function (d) {
    return parseInt(d.getFullYear().toString().substring(0, 2), 10)
  }
}

const formatCodes = {
  a: function (d) {
    return dayNamesShort[d.getDay()]
  },
  A: function (d) {
    return dayNames[d.getDay()]
  },
  b: function (d) {
    return monthNamesShort[d.getMonth()]
  },
  B: function (d) {
    return monthNames[d.getMonth()]
  },
  c: function (d) {
    return d.toLocaleString()
  },
  C: function (d) {
    return _date.century(d)
  },
  d: function (d) {
    return padStart(d.getDate(), 2, '0')
  },
  e: function (d) {
    return padStart(d.getDate(), 2)
  },
  H: function (d) {
    return padStart(d.getHours(), 2, '0')
  },
  I: function (d) {
    return padStart(String(d.getHours() % 12 || 12), 2, '0')
  },
  j: function (d) {
    return padStart(_date.getDayOfYear(d), 3, '0')
  },
  k: function (d) {
    return padStart(d.getHours(), 2)
  },
  l: function (d) {
    return padStart(String(d.getHours() % 12 || 12), 2)
  },
  L: function (d) {
    return padStart(d.getMilliseconds(), 3, '0')
  },
  m: function (d) {
    return padStart(d.getMonth() + 1, 2, '0')
  },
  M: function (d) {
    return padStart(d.getMinutes(), 2, '0')
  },
  p: function (d) {
    return (d.getHours() < 12 ? 'AM' : 'PM')
  },
  P: function (d) {
    return (d.getHours() < 12 ? 'am' : 'pm')
  },
  q: function (d) {
    return _date.getSuffix(d)
  },
  s: function (d) {
    return Math.round(d.valueOf() / 1000)
  },
  S: function (d) {
    return padStart(d.getSeconds(), 2, '0')
  },
  u: function (d) {
    return d.getDay() || 7
  },
  U: function (d) {
    return _date.getWeekOfYear(d, 0)
  },
  w: function (d) {
    return d.getDay()
  },
  W: function (d) {
    return _date.getWeekOfYear(d, 1)
  },
  x: function (d) {
    return d.toLocaleDateString()
  },
  X: function (d) {
    return d.toLocaleTimeString()
  },
  y: function (d) {
    return d.getFullYear().toString().substring(2, 4)
  },
  Y: function (d) {
    return d.getFullYear()
  },
  z: function (d) {
    const tz = d.getTimezoneOffset() / 60 * 100
    return (tz > 0 ? '-' : '+') + padStart(String(Math.abs(tz)), 4, '0')
  },
  '%': function () {
    return '%'
  }
};
(formatCodes as any).h = formatCodes.b;
(formatCodes as any).N = formatCodes.L

export default function (d, format) {
  let output = ''
  let remaining = format

  while (true) {
    const r = /%./g
    const results = r.exec(remaining)

    // No more format codes. Add the remaining text and return
    if (!results) {
      return output + remaining
    }

    // Add the preceding text
    output += remaining.slice(0, r.lastIndex - 2)
    remaining = remaining.slice(r.lastIndex)

    // Add the format code
    const ch = results[0].charAt(1)
    const func = formatCodes[ch]
    output += func ? func.call(this, d) : '%' + ch
  }
}
