import { LiquidDate } from './liquid-date'
import { disableIntl } from '../../test/stub/no-intl'

describe('LiquidDate', () => {
  describe('timezone', () => {
    it('should respect timezone set to 00:00', () => {
      const date = new LiquidDate('2021-10-06T14:26:00.000+08:00', 'en-US', 0)
      expect(date.getTimezoneOffset()).toBe(0)
      expect(date.getHours()).toBe(6)
      expect(date.getMinutes()).toBe(26)
    })
    it('should respect timezone set to -06:00', () => {
      const date = new LiquidDate('2021-10-06T14:26:00.000+08:00', 'en-US', -360)
      expect(date.getTimezoneOffset()).toBe(-360)
      expect(date.getMinutes()).toBe(26)
    })
  })
  it('should support Date as argument', () => {
    const date = new LiquidDate(new Date('2021-10-06T14:26:00.000+08:00'), 'en-US', 0)
    expect(date.getHours()).toBe(6)
  })
  it('should support .getMilliseconds()', () => {
    const date = new LiquidDate('2021-10-06T14:26:00.001+00:00', 'en-US', 0)
    expect(date.getMilliseconds()).toBe(1)
  })
  it('should support .getDay()', () => {
    const date = new LiquidDate('2021-12-07T00:00:00.001+08:00', 'en-US', -480)
    expect(date.getDay()).toBe(2)
  })
  it('should support .toLocaleString()', () => {
    const date = new LiquidDate('2021-10-06T00:00:00.001+00:00', 'en-US', -480)
    expect(date.toLocaleString('en-US')).toMatch(/8:00:00\sAM$/)
    expect(date.toLocaleString('en-US', { timeZone: 'America/New_York' })).toMatch(/8:00:00\sPM$/)
    expect(() => date.toLocaleString()).not.toThrow()
  })
  it('should support .toLocaleTimeString()', () => {
    const date = new LiquidDate('2021-10-06T00:00:00.001+00:00', 'en-US', -480)
    expect(date.toLocaleTimeString('en-US')).toMatch(/^8:00:00\sAM$/)
    expect(() => date.toLocaleDateString()).not.toThrow()
  })
  it('should support .toLocaleDateString()', () => {
    const date = new LiquidDate('2021-10-06T22:00:00.001+00:00', 'en-US', -480)
    expect(date.toLocaleDateString('en-US')).toBe('10/7/2021')
    expect(() => date.toLocaleDateString()).not.toThrow()
  })
  describe('compatibility', () => {
    disableIntl()
    it('should use English months if Intl.DateTimeFormat not supported', () => {
      expect(new LiquidDate('2021-10-06T22:00:00.001+00:00', 'en-US', -480).getLongMonthName()).toEqual('October')
      expect(new LiquidDate('2021-10-06T22:00:00.001+00:00', 'zh-CN', -480).getLongMonthName()).toEqual('October')
      expect(new LiquidDate('2021-10-06T22:00:00.001+00:00', 'zh-CN', -480).getShortMonthName()).toEqual('Oct')
    })
    it('should use English weekdays if Intl.DateTimeFormat not supported', () => {
      expect(new LiquidDate('2024-07-21T22:00:00.001+00:00', 'en-US', 0).getLongWeekdayName()).toEqual('Sunday')
      expect(new LiquidDate('2024-07-21T22:00:00.001+00:00', 'zh-CN', -480).getLongWeekdayName()).toEqual('Monday')
      expect(new LiquidDate('2024-07-21T22:00:00.001+00:00', 'zh-CN', -480).getShortWeekdayName()).toEqual('Mon')
    })
    it('should return none for timezone if Intl.DateTimeFormat not supported', () => {
      expect(new LiquidDate('2024-07-21T22:00:00.001', 'en-US').getTimeZoneName()).toEqual(undefined)
    })
  })
})
