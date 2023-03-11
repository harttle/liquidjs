import { normalize } from './liquid-options'

describe('liquid-options', () => {
  describe('.normalize()', () => {
    it('should set cache to undefined if specified to falsy', () => {
      const options = normalize({ cache: false })
      expect(options.cache).toBeUndefined()
    })
  })
})
