import { TimeLimiter } from './limiter'

describe('TimeLimiter', () => {
  describe('#check()', () => {
    afterEach(() => jest.restoreAllMocks())
    it('should not read the clock when unlimited', () => {
      const now = jest.spyOn(global.performance, 'now')
      new TimeLimiter('template render', Infinity).check()
      expect(now).not.toHaveBeenCalled()
    })
    it('should throw when the deadline has passed', () => {
      const limiter = new TimeLimiter('template render', global.performance.now() - 1)
      expect(() => limiter.check()).toThrow('template render limit exceeded')
    })
  })
})
