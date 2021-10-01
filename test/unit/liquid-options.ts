import { normalize } from '../../src/liquid-options'
import { expect } from 'chai'

describe('liquid-options', () => {
  describe('.normalize()', () => {
    it('should return plain object for empty input', () => {
      const options = normalize()
      expect(JSON.stringify(options)).to.equal('{}')
    })
    it('should set falsy cache to undefined', () => {
      const options = normalize({ cache: false })
      expect(JSON.stringify(options)).to.equal('{}')
    })
  })
})
