import { TimezoneDate } from '../../../src/util/timezone-date'
import { expect } from 'chai'

describe('TimezoneDate', () => {
  it('should respect timezone set to 00:00', () => {
    const date = new TimezoneDate('2021-10-06T14:26:00.000+08:00', 0)
    expect(date.getTimezoneOffset()).to.equal(0)
    expect(date.getHours()).to.equal(6)
    expect(date.getMinutes()).to.equal(26)
  })
  it('should respect timezone set to -06:00', () => {
    const date = new TimezoneDate('2021-10-06T14:26:00.000+08:00', -360)
    expect(date.getTimezoneOffset()).to.equal(-360)
    expect(date.getMinutes()).to.equal(26)
  })
})
