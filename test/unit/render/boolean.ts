import { isTruthy } from '../../../src/render/boolean'
import { expect } from 'chai'

describe('boolean', async function () {
  describe('.isTruthy()', async function () {
    // Spec: https://shopify.github.io/liquid/basics/truthy-and-falsy/
    it('true is truthy', function () {
      expect(isTruthy(true)).to.be.true
    })
    it('false is falsy', function () {
      expect(isTruthy(false)).to.be.false
    })
    it('null is falsy', function () {
      expect(isTruthy(null)).to.be.false
    })
    it('"foo" is truthy', function () {
      expect(isTruthy('foo')).to.be.true
    })
    it('"" is truthy', function () {
      expect(isTruthy('')).to.be.true
    })
    it('0 is truthy', function () {
      expect(isTruthy(0)).to.be.true
    })
    it('1 is truthy', function () {
      expect(isTruthy(1)).to.be.true
    })
    it('1.1 is truthy', function () {
      expect(isTruthy(1.1)).to.be.true
    })
    it('[1] is truthy', function () {
      expect(isTruthy([1])).to.be.true
    })
    it('[] is truthy', function () {
      expect(isTruthy([])).to.be.true
    })
  })
})
