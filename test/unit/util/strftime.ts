import * as chai from 'chai'
import t from '../../../src/util/strftime'
import { DateWithTimezone } from '../../stub/date-with-timezone'
const expect = chai.expect

describe('util/strftime', function () {
  const now = new Date('2016-01-04 13:15:23')
  const then = new Date('2016-03-06 03:05:03')

  describe('Date (Year, Month, Day)', () => {
    it('should format %C as century', function () {
      expect(t(now, '%C')).to.equal('20')
    })
    it('should format %B as month name', function () {
      expect(t(now, '%B')).to.equal('January')
    })
    it('should format %e as space padded date', function () {
      expect(t(now, '%e')).to.equal(' 4')
    })
    it('should format %y as 2-digit year', function () {
      expect(t(now, '%y')).to.equal('16')
    })
    describe('%j', function () {
      it('should format %j as day of year', function () {
        expect(t(then, '%j')).to.equal('066')
      })
      it('should take count of leap years', function () {
        const date = new Date('2001 03 01')
        expect(t(date, '%j')).to.equal('060')
      })
      it('should take count of leap years', function () {
        const date = new Date('2000 03 01')
        expect(t(date, '%j')).to.equal('061')
      })
    })
    it('should format %q as date suffix', function () {
      const st = new Date('2016-03-01 03:05:03')
      const nd = new Date('2016-03-02 03:05:03')
      const rd = new Date('2016-03-03 03:05:03')
      expect(t(st, '%q')).to.equal('st')
      expect(t(nd, '%q')).to.equal('nd')
      expect(t(rd, '%q')).to.equal('rd')
      expect(t(now, '%q')).to.equal('th')
    })
  })

  describe('Time (Hour, Minute, Second, Subsecond)', function () {
    it('should format %I as 0 padded hour12', function () {
      expect(t(now, '%I')).to.equal('01')
    })
    it('should format %I as 12 for 00:00', function () {
      const date = new Date('2016-01-01 00:00:00')
      expect(t(date, '%I')).to.equal('12')
    })
    it('should format %k as space padded hour', function () {
      expect(t(then, '%k')).to.equal(' 3')
    })
    it('should format %l as space padded hour12', function () {
      expect(t(now, '%l')).to.equal(' 1')
    })
    it('should format %l as 12 for 00:00', function () {
      const date = new Date('2016-01-01 00:00:00')
      expect(t(date, '%l')).to.equal('12')
    })
    it('should format %L as 0 padded millisecond', function () {
      expect(t(then, '%L')).to.equal('000')
    })
    it('should format %N as fractional seconds digits', function () {
      const time = new Date('2019-12-15 01:21:00.129')
      expect(t(time, '%N')).to.equal('129000000')
      expect(t(time, '%2N')).to.equal('12')
      expect(t(time, '%10N')).to.equal('1290000000')
      expect(t(time, '%0N')).to.equal('129000000')
    })
    it('should format %p as upper cased am/pm', function () {
      expect(t(now, '%p')).to.equal('PM')
      expect(t(then, '%p')).to.equal('AM')
    })
    it('should format %P as lower cased am/pm', function () {
      expect(t(now, '%P')).to.equal('pm')
      expect(t(now, '%^8P')).to.equal('      PM')
      expect(t(then, '%P')).to.equal('am')
    })
  })

  describe('Weekday', function () {
    it('should format %A as Monday', function () {
      expect(t(now, '%A')).to.equal('Monday')
      expect(t(now, '%^A')).to.equal('MONDAY')
      expect(t(now, '%#A')).to.equal('MONDAY')
    })
    it('should format %a as Mon', function () {
      expect(t(now, '%a')).to.equal('Mon')
      expect(t(now, '%^a')).to.equal('MON')
    })
    it('should format %u as day of week(1-7)', function () {
      expect(t(now, '%u')).to.be.equal('1')
      expect(t(then, '%u')).to.be.equal('7')
    })
    it('should format %w as day of week(0-7)', function () {
      expect(t(now, '%w')).to.be.equal('1')
      expect(t(then, '%w')).to.be.equal('0')
    })
  })

  describe('Seconds since the Unix Epoch', () => {
    it('should format %s as UNIX seconds', function () {
      expect(t(now, '%s')).to.be.match(/\d+/)
    })
  })

  describe('Week number', () => {
    it('should format %U as week of year, starts with 0', function () {
      expect(t(now, '%U')).to.equal('01')
    })
    it('should format %W as week of year, starts with 1', function () {
      expect(t(now, '%W')).to.be.equal('01')
    })
  })

  describe('Time zone', () => {
    it('should format %z as time zone', function () {
      // suppose we're in +8:00
      const now = new DateWithTimezone('2016-01-04 13:15:23', -480)
      expect(t(now, '%z')).to.equal('+0800')
    })
    it('should format %z as negative time zone', function () {
      // suppose we're in -8:00
      const date = new DateWithTimezone('2016-01-04T13:15:23.000Z', 480)
      expect(t(date, '%z')).to.equal('-0800')
    })
  })

  describe('combination', () => {
    it('should format %x as local date string', function () {
      expect(t(now, '%x')).to.equal(now.toLocaleDateString())
    })
    it('should format %X as local time string', function () {
      expect(t(now, '%X')).to.equal(now.toLocaleTimeString())
    })
    it('should format detailed datetime', function () {
      expect(t(now, '%Y-%m-%d %H:%M:%S')).to.equal('2016-01-04 13:15:23')
    })

    it('should format %c as local string', function () {
      expect(t(now, '%c')).to.equal(now.toLocaleString())
    })
  })

  describe('literal strings', () => {
    it('should escape %% as %', function () {
      expect(t(now, '%%')).to.equal('%')
    })
    it('should escape %n as \\n', function () {
      expect(t(now, '%n')).to.equal('\n')
    })
    it('should escape %t as \\t', function () {
      expect(t(now, '%t')).to.equal('\t')
    })
    it('should retain un-recognized formaters', function () {
      expect(t(now, '%o')).to.equal('%o')
    })
  })

  describe('width field', () => {
    it('should support width field', () => {
      expect(t(now, '%8Y')).to.equal('00002016')
    })
    it('should ignore invalid width', () => {
      expect(t(then, '%1Y')).to.equal('2016')
      expect(t(then, '%1H')).to.equal('3')
    })
    it('should have higher priority than H', () => {
      expect(t(then, '%0H')).to.equal('03')
    })
  })
  describe('modifier field', () => {
    it('should ignore E modifier', () => {
      expect(t(now, '%EY')).to.equal('2016')
    })
    it('should ignore O modifier', () => {
      expect(t(now, '%OY')).to.equal('2016')
    })
    it('should support modifier with width field', () => {
      expect(t(now, '%8EY')).to.equal('00002016')
    })
  })
  describe('flags field', () => {
    it('should support - flag', () => {
      expect(t(now, '%-m')).to.equal('1')
    })
    it('should support _ flag', () => {
      expect(t(now, '%_m')).to.equal(' 1')
    })
    it('should support 0 flag', () => {
      expect(t(now, '%0m')).to.equal('01')
    })
    it('should support ^ flag', () => {
      expect(t(now, '%^B')).to.equal('JANUARY')
    })
    it('should respect to specific conversion', () => {
      expect(t(now, '%^P')).to.equal('PM')
      expect(t(now, '%P')).to.equal('pm')
    })
    it('should support # flag', () => {
      expect(t(now, '%#B')).to.equal('JANUARY')
      expect(t(now, '%#P')).to.equal('PM')
    })
    it('should support : flag', () => {
      // suppose we're in +8:00
      const date = new DateWithTimezone('2016-01-04T13:15:23.000Z', -480)
      expect(t(date, '%:z')).to.equal('+08:00')
      expect(t(date, '%z')).to.equal('+0800')
    })
    it('should support multiple flags', () => {
      expect(t(now, '%^08P')).to.equal('000000PM')
    })
  })
})
