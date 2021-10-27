import { normalize } from '../../src/liquid-options'
import { expect } from 'chai'

describe('liquid-options', () => {
  describe('.normalize()', () => {
    it('should set cache to undefined if specified to falsy', () => {
      const options = normalize({ cache: false })
      expect(options.cache).to.equal(undefined)
    })
  })
})
