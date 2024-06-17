import { strftime as t } from './strftime'
import { DateWithTimezone } from '../../test/stub/date-with-timezone'

describe('util/strftime', function () {
  const now = new Date('2016-01-04 13:15:23')
  const then = new Date('2016-03-06 03:05:03')

  describe('Date (Year, Month, Day)', () => {
    it('should format %C as century', function () {
      expect(t(now, '%C')).toBe('20')
    })
    it('should format %B as month name', function () {
      expect(t(now, '%B')).toBe('January')
    })
    it('should format %e as space padded date', function () {
      expect(t(now, '%e')).toBe(' 4')
    })
    it('should format %y as 2-digit year', function () {
      expect(t(now, '%y')).toBe('16')
    })
    describe('%j', function () {
      it('should format %j as day of year', function () {
        expect(t(then, '%j')).toBe('066')
      })
      it('should take count of leap years', function () {
        const date = new Date('2001 03 01')
        expect(t(date, '%j')).toBe('060')
      })
      it('should take count of leap years', function () {
        const date = new Date('2000 03 01')
        expect(t(date, '%j')).toBe('061')
      })
    })
    it('should format %q as date suffix', function () {
      const first = new Date('2016-03-01 03:05:03')
      const second = new Date('2016-03-02 03:05:03')
      const third = new Date('2016-03-03 03:05:03')

      const eleventh = new Date('2016-03-11 03:05:03')
      const twelfth = new Date('2016-03-12 03:05:03')
      const thirteenth = new Date('2016-03-13 03:05:03')

      const twentyfirst = new Date('2016-03-21 03:05:03')
      const twentysecond = new Date('2016-03-22 03:05:03')
      const twentythird = new Date('2016-03-23 03:05:03')

      expect(t(first, '%q')).toBe('st')
      expect(t(second, '%q')).toBe('nd')
      expect(t(third, '%q')).toBe('rd')
      expect(t(now, '%q')).toBe('th')

      expect(t(eleventh, '%q')).toBe('th')
      expect(t(twelfth, '%q')).toBe('th')
      expect(t(thirteenth, '%q')).toBe('th')

      expect(t(twentyfirst, '%q')).toBe('st')
      expect(t(twentysecond, '%q')).toBe('nd')
      expect(t(twentythird, '%q')).toBe('rd')
    })
  })

  describe('Time (Hour, Minute, Second, Subsecond)', function () {
    it('should format %I as 0 padded hour12', function () {
      expect(t(now, '%I')).toBe('01')
    })
    it('should format %I as 12 for 00:00', function () {
      const date = new Date('2016-01-01 00:00:00')
      expect(t(date, '%I')).toBe('12')
    })
    it('should format %k as space padded hour', function () {
      expect(t(then, '%k')).toBe(' 3')
    })
    it('should format %l as space padded hour12', function () {
      expect(t(now, '%l')).toBe(' 1')
    })
    it('should format %l as 12 for 00:00', function () {
      const date = new Date('2016-01-01 00:00:00')
      expect(t(date, '%l')).toBe('12')
    })
    it('should format %L as 0 padded millisecond', function () {
      expect(t(then, '%L')).toBe('000')
    })
    it('should format %N as fractional seconds digits', function () {
      const time = new Date('2019-12-15 01:21:00.129')
      expect(t(time, '%N')).toBe('129000000')
      expect(t(time, '%2N')).toBe('12')
      expect(t(time, '%10N')).toBe('1290000000')
      expect(t(time, '%0N')).toBe('129000000')
    })
    it('should format %p as upper cased am/pm', function () {
      expect(t(now, '%p')).toBe('PM')
      expect(t(then, '%p')).toBe('AM')
    })
    it('should format %P as lower cased am/pm', function () {
      expect(t(now, '%P')).toBe('pm')
      expect(t(now, '%^8P')).toBe('      PM')
      expect(t(then, '%P')).toBe('am')
    })
  })

  describe('Weekday', function () {
    it('should format %A as Monday', function () {
      expect(t(now, '%A')).toBe('Monday')
      expect(t(now, '%^A')).toBe('MONDAY')
      expect(t(now, '%#A')).toBe('MONDAY')
    })
    it('should format %a as Mon', function () {
      expect(t(now, '%a')).toBe('Mon')
      expect(t(now, '%^a')).toBe('MON')
    })
    it('should format %u as day of week(1-7)', function () {
      expect(t(now, '%u')).toBe('1')
      expect(t(then, '%u')).toBe('7')
    })
    it('should format %w as day of week(0-7)', function () {
      expect(t(now, '%w')).toBe('1')
      expect(t(then, '%w')).toBe('0')
    })
  })

  describe('Seconds since the Unix Epoch', () => {
    it('should format %s as UNIX seconds', function () {
      expect(t(now, '%s')).toMatch(/\d+/)
    })
  })

  describe('Week number', () => {
    it('should format %U as week of year, starts with 0', function () {
      expect(t(now, '%U')).toBe('01')
    })
    it('should format %W as week of year, starts with 1', function () {
      expect(t(now, '%W')).toBe('01')
    })
  })

  describe('Time zone', () => {
    it('should format %z as time zone', function () {
      // suppose we're in +8:00
      const now = new DateWithTimezone('2016-01-04 13:15:23', -480)
      expect(t(now, '%z')).toBe('+0800')
    })
    it('should format %z as negative time zone', function () {
      // suppose we're in -8:00
      const date = new DateWithTimezone('2016-01-04T13:15:23.000Z', 480)
      expect(t(date, '%z')).toBe('-0800')
    })
  })

  describe('combination', () => {
    it('should format %x as local date string', function () {
      expect(t(now, '%x')).toBe(now.toLocaleDateString())
    })
    it('should format %X as local time string', function () {
      expect(t(now, '%X')).toBe(now.toLocaleTimeString())
    })
    it('should format detailed datetime', function () {
      expect(t(now, '%Y-%m-%d %H:%M:%S')).toBe('2016-01-04 13:15:23')
    })

    it('should format %c as local string', function () {
      expect(t(now, '%c')).toBe(now.toLocaleString())
    })
  })

  describe('literal strings', () => {
    it('should escape %% as %', function () {
      expect(t(now, '%%')).toBe('%')
    })
    it('should escape %n as \\n', function () {
      expect(t(now, '%n')).toBe('\n')
    })
    it('should escape %t as \\t', function () {
      expect(t(now, '%t')).toBe('\t')
    })
    it('should retain un-recognized formatters', function () {
      expect(t(now, '%o')).toBe('%o')
    })
  })

  describe('width field', () => {
    it('should support width field', () => {
      expect(t(now, '%8Y')).toBe('00002016')
    })
    it('should ignore invalid width', () => {
      expect(t(then, '%1Y')).toBe('2016')
      expect(t(then, '%1H')).toBe('3')
    })
    it('should have higher priority than H', () => {
      expect(t(then, '%0H')).toBe('03')
    })
  })
  describe('modifier field', () => {
    it('should ignore E modifier', () => {
      expect(t(now, '%EY')).toBe('2016')
    })
    it('should ignore O modifier', () => {
      expect(t(now, '%OY')).toBe('2016')
    })
    it('should support modifier with width field', () => {
      expect(t(now, '%8EY')).toBe('00002016')
    })
  })
  describe('flags field', () => {
    it('should support - flag', () => {
      expect(t(now, '%-m')).toBe('1')
    })
    it('should support _ flag', () => {
      expect(t(now, '%_m')).toBe(' 1')
    })
    it('should support 0 flag', () => {
      expect(t(now, '%0m')).toBe('01')
    })
    it('should support ^ flag', () => {
      expect(t(now, '%^B')).toBe('JANUARY')
    })
    it('should respect to specific conversion', () => {
      expect(t(now, '%^P')).toBe('PM')
      expect(t(now, '%P')).toBe('pm')
    })
    it('should support # flag', () => {
      expect(t(now, '%#B')).toBe('JANUARY')
      expect(t(now, '%#P')).toBe('PM')
    })
    it('should support : flag', () => {
      // suppose we're in +8:00
      const date = new DateWithTimezone('2016-01-04T13:15:23.000Z', -480)
      expect(t(date, '%:z')).toBe('+08:00')
      expect(t(date, '%z')).toBe('+0800')
    })
    it('should support multiple flags', () => {
      expect(t(now, '%^08P')).toBe('000000PM')
    })
  })
})
