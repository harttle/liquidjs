import * as chai from 'chai'
import t from '../../../src/util/strftime'

const expect = chai.expect

describe('util/strftime', function () {
  let now: Date
  let then: Date
  before(function () {
    mockUTC()
    now = new Date('2016-01-04T13:15:23.000Z')
    then = new Date('2016-03-06T03:05:03.000Z')
  })
  after(function () {
    restoreUTC()
  })

  it('should format UTC datetime', function () {
    expect(t(now, '%Y-%m-%dT%H:%M:%S')).to.equal('2016-01-04T13:15:23')
  })
  it('should format %A as Monday', function () {
    expect(t(now, '%A')).to.equal('Monday')
  })
  it('should format %B as month name', function () {
    expect(t(now, '%B')).to.equal('January')
  })
  it('should format %C as century', function () {
    expect(t(now, '%C')).to.equal('20')
  })
  it('should format %c as local string', function () {
    expect(t(now, '%c')).to.equal(now.toLocaleString())
  })
  it('should format %e as space padded date', function () {
    expect(t(now, '%e')).to.equal(' 4')
  })
  it('should format %I as 0 padded hour12', function () {
    expect(t(now, '%I')).to.equal('01')
  })
  it('should format %I as 12 for 00:00', function () {
    const date = new Date('2016-01-01T00:00:00.000Z')
    expect(t(date, '%I')).to.equal('12')
  })
  describe('%j', function () {
    it('should format %j as day of year', function () {
      expect(t(then, '%j')).to.equal('066')
    })
    it('should take count of leap years', function () {
      const date = new Date('2001-03-01')
      expect(t(date, '%j')).to.equal('060')
    })
    it('should take count of leap years', function () {
      const date = new Date('2000-03-01')
      expect(t(date, '%j')).to.equal('061')
    })
  })
  it('should format %k as space padded hour', function () {
    expect(t(then, '%k')).to.equal(' 3')
  })
  it('should format %l as space padded hour12', function () {
    expect(t(now, '%l')).to.equal(' 1')
  })
  it('should format %l as 12 for 00:00', function () {
    const date = new Date('2016-01-01T00:00:00.000Z')
    expect(t(date, '%l')).to.equal('12')
  })
  it('should format %L as 0 padded millisecond', function () {
    expect(t(then, '%L')).to.equal('000')
  })
  it('should format %p as upper cased am/pm', function () {
    expect(t(now, '%p')).to.equal('PM')
    expect(t(then, '%p')).to.equal('AM')
  })
  it('should format %P as lower cased am/pm', function () {
    expect(t(now, '%P')).to.equal('pm')
    expect(t(then, '%P')).to.equal('am')
  })
  it('should format %q as date suffix', function () {
    const st = new Date('2016-03-01T03:05:03.000Z')
    const nd = new Date('2016-03-02T03:05:03.000Z')
    const rd = new Date('2016-03-03T03:05:03.000Z')
    expect(t(st, '%q')).to.equal('st')
    expect(t(nd, '%q')).to.equal('nd')
    expect(t(rd, '%q')).to.equal('rd')
    expect(t(now, '%q')).to.equal('th')
  })
  it('should format %s as UNIX seconds', function () {
    expect(t(now, '%s')).to.be.match(/\d+/)
  })
  it('should format %u as day of week(1-7)', function () {
    expect(t(now, '%u')).to.be.equal('1')
    expect(t(then, '%u')).to.be.equal('7')
  })
  it('should format %U as week of year, starts with 0', function () {
    expect(t(now, '%U')).to.equal('01')
  })
  it('should format %w as day of month(0-7)', function () {
    expect(t(now, '%w')).to.be.equal('1')
    expect(t(then, '%w')).to.be.equal('0')
  })
  it('should format %W as week of year, starts with 1', function () {
    expect(t(now, '%W')).to.be.equal('01')
  })
  it('should format %x as local date string', function () {
    expect(t(now, '%x')).to.equal(now.toLocaleDateString())
  })
  it('should format %X as local time string', function () {
    expect(t(now, '%X')).to.equal(now.toLocaleTimeString())
  })
  it('should format %y as 2-digit year', function () {
    expect(t(now, '%y')).to.equal('16')
  })
  it('should format %z as time zone', function () {
    expect(t(now, '%z')).to.equal('+0800')
  })
  it('should format %z as negative time zone', function () {
    const date = new Date('2016-01-04T13:15:23.000Z')
    date.getTimezoneOffset = () => 480
    expect(t(date, '%z')).to.equal('-0800')
  })
  it('should escape %% as %', function () {
    expect(t(now, '%%')).to.equal('%')
  })
  it('should retain un-recognized formaters', function () {
    expect(t(now, '%o')).to.equal('%o')
  })
})

function mockUTC () {
  const p = Date.prototype as any

  p._getHours = p.getHours
  p.getHours = p.getUTCHours

  p._getDays = p.getDays
  p.getDays = p.getUTCDays

  p._getTimezoneOffset = p.getTimezoneOffset
  p.getTimezoneOffset = () => -480
}

function restoreUTC () {
  const p = Date.prototype as any
  p.getHours = p._getHours
  p.getDays = p._getDays
  p.getTimezoneOffset = p._getTimezoneOffset
}
