import { isTruthy, isFalsy } from '../../../src/render/boolean'
import { Context } from '../../../src/context/context'
import { expect } from 'chai'

describe('boolean Shopify', async function () {
  describe('.isTruthy()', async function () {
    const ctx = {
      opts: {
        jsTruthy: false
      }
    } as unknown as Context
    //
    // Spec: https://shopify.github.io/liquid/basics/truthy-and-falsy/
    it('true is truthy', function () {
      expect(isTruthy(true, ctx)).to.be.true
    })
    it('false is falsy', function () {
      expect(isTruthy(false, ctx)).to.be.false
    })
    it('null is falsy', function () {
      expect(isTruthy(null, ctx)).to.be.false
    })
    it('"foo" is truthy', function () {
      expect(isTruthy('foo', ctx)).to.be.true
    })
    it('"" is truthy', function () {
      expect(isTruthy('', ctx)).to.be.true
    })
    it('0 is truthy', function () {
      expect(isTruthy(0, ctx)).to.be.true
    })
    it('1 is truthy', function () {
      expect(isTruthy(1, ctx)).to.be.true
    })
    it('1.1 is truthy', function () {
      expect(isTruthy(1.1, ctx)).to.be.true
    })
    it('[1] is truthy', function () {
      expect(isTruthy([1], ctx)).to.be.true
    })
    it('[] is truthy', function () {
      expect(isTruthy([], ctx)).to.be.true
    })
  })
})

describe('boolean jsTruthy', async function () {
  const ctx = {
    opts: {
      jsTruthy: true
    }
  } as unknown as Context

  describe('.isFalsy()', async function () {
    it('null is always falsy', function () {
      expect(isFalsy(null, ctx)).to.be.true
    })
  })

  describe('.isTruthy()', async function () {
    it('true is truthy', function () {
      expect(isTruthy(true, ctx)).to.be.true
    })
    it('false is falsy', function () {
      expect(isTruthy(false, ctx)).to.be.false
    })
    it('null is always falsy', function () {
      expect(isTruthy(null, ctx)).to.be.false
    })
    it('null is always falsy', function () {
      expect(isTruthy(null, ctx)).to.be.false
    })
    it('"foo" is truthy', function () {
      expect(isTruthy('foo', ctx)).to.be.true
    })
    it('"" is falsy', function () {
      expect(isTruthy('', ctx)).to.be.false
    })
    it('0 is falsy', function () {
      expect(isTruthy(0, ctx)).to.be.false
    })
    it('1 is truthy', function () {
      expect(isTruthy(1, ctx)).to.be.true
    })
    it('1.1 is truthy', function () {
      expect(isTruthy(1.1, ctx)).to.be.true
    })
    it('[1] is truthy', function () {
      expect(isTruthy([1], ctx)).to.be.true
    })
    it('[] is truthy', function () {
      expect(isTruthy([], ctx)).to.be.true
    })
  })
})
