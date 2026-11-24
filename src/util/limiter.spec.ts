import { TimeLimiter } from './limiter'

describe('TimeLimiter', () => {
  describe('#check()', () => {
    let globalPerformance: Performance
    beforeEach(() => {
      globalPerformance = global.performance
    })
    afterEach(() => {
      global.performance = globalPerformance
    })
    it('should not read the clock when unlimited', () => {
      const now = jest.fn(() => 0)
      global.performance = { now } as any as Performance
      new TimeLimiter('template render', Infinity).check()
      expect(now).not.toHaveBeenCalled()
    })
    it('should throw when the deadline has passed', () => {
      const limiter = new TimeLimiter('template render', global.performance.now() - 1)
      expect(() => limiter.check()).toThrow('template render limit exceeded')
    })
  })
})
