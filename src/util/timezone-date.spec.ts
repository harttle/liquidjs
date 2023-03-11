import { TimezoneDate } from './timezone-date'

describe('TimezoneDate', () => {
  it('should respect timezone set to 00:00', () => {
    const date = new TimezoneDate('2021-10-06T14:26:00.000+08:00', 0)
    expect(date.getTimezoneOffset()).toBe(0)
    expect(date.getHours()).toBe(6)
    expect(date.getMinutes()).toBe(26)
  })
  it('should respect timezone set to -06:00', () => {
    const date = new TimezoneDate('2021-10-06T14:26:00.000+08:00', -360)
    expect(date.getTimezoneOffset()).toBe(-360)
    expect(date.getMinutes()).toBe(26)
  })
  it('should support Date as argument', () => {
    const date = new TimezoneDate(new Date('2021-10-06T14:26:00.000+08:00'), 0)
    expect(date.getHours()).toBe(6)
  })
  it('should support .getMilliseconds()', () => {
    const date = new TimezoneDate('2021-10-06T14:26:00.001+00:00', 0)
    expect(date.getMilliseconds()).toBe(1)
  })
  it('should support .getDay()', () => {
    const date = new TimezoneDate('2021-12-07T00:00:00.001+08:00', -480)
    expect(date.getDay()).toBe(2)
  })
  it('should support .toLocaleTimeString()', () => {
    const date = new TimezoneDate('2021-10-06T00:00:00.001+00:00', -480)
    expect(date.toLocaleTimeString('en-US')).toBe('8:00:00 AM')
    expect(() => date.toLocaleDateString()).not.toThrow()
  })
  it('should support .toLocaleDateString()', () => {
    const date = new TimezoneDate('2021-10-06T22:00:00.001+00:00', -480)
    expect(date.toLocaleDateString('en-US')).toBe('10/7/2021')
    expect(() => date.toLocaleDateString()).not.toThrow()
  })
})
