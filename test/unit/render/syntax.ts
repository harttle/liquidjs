import { Context } from '../../../src/context/context'
import { expect } from 'chai'
import { evalExp, evalValue, isTruthy } from '../../../src/render/syntax'

describe('render/syntax', function () {
  let ctx: Context

  beforeEach(function () {
    ctx = new Context({
      one: 1,
      two: 2,
      empty: '',
      x: 'XXX',
      y: undefined,
      z: null,
      'has_value?': true
    })
  })

  describe('.evalValue()', function () {
    it('should eval boolean literal', async function () {
      expect(await evalValue('true', ctx)).to.equal(true)
      expect(await evalValue('TrUE', ctx)).to.equal(undefined)
      expect(await evalValue('false', ctx)).to.equal(false)
    })
    it('should eval number literal', async function () {
      expect(await evalValue('2.3', ctx)).to.equal(2.3)
      expect(await evalValue('.32', ctx)).to.equal(0.32)
      expect(await evalValue('-23.', ctx)).to.equal(-23)
      expect(await evalValue('23', ctx)).to.equal(23)
    })
    it('should eval string literal', async function () {
      expect(await evalValue('"ab\'c"', ctx)).to.equal("ab'c")
      expect(await evalValue("'ab\"c'", ctx)).to.equal('ab"c')
    })
    it('should eval nil literal', async function () {
      expect(await evalValue('nil', ctx)).to.be.null
    })
    it('should eval null literal', async function () {
      expect(await evalValue('null', ctx)).to.be.null
    })
    it('should eval scope variables', async function () {
      expect(await evalValue('one', ctx)).to.equal(1)
      expect(await evalValue('has_value?', ctx)).to.equal(true)
      expect(await evalValue('x', ctx)).to.equal('XXX')
    })
  })

  describe('.isTruthy()', async function () {
    // Spec: https://shopify.github.io/liquid/basics/truthy-and-falsy/
    expect(isTruthy(true)).to.be.true
    expect(isTruthy(false)).to.be.false
    expect(isTruthy(null)).to.be.false
    expect(isTruthy('foo')).to.be.true
    expect(isTruthy('')).to.be.true
    expect(isTruthy(0)).to.be.true
    expect(isTruthy(1)).to.be.true
    expect(isTruthy(1.1)).to.be.true
    expect(isTruthy([1])).to.be.true
    expect(isTruthy([])).to.be.true
  })

  describe('.evalExp()', function () {
    it('should throw when scope undefined', async function () {
      return expect(() => (evalExp as any)('')).to.throw(/scope undefined/)
    })

    it('should eval simple expression', async function () {
      expect(await evalExp('1<2', ctx)).to.equal(true)
      expect(await evalExp('2<=2', ctx)).to.equal(true)
      expect(await evalExp('one<=two', ctx)).to.equal(true)
      expect(await evalExp('x contains "x"', ctx)).to.equal(false)
      expect(await evalExp('x contains "X"', ctx)).to.equal(true)
      expect(await evalExp('1 contains "x"', ctx)).to.equal(false)
      expect(await evalExp('y contains "x"', ctx)).to.equal(false)
      expect(await evalExp('z contains "x"', ctx)).to.equal(false)
      expect(await evalExp('(1..5) contains 3', ctx)).to.equal(true)
      expect(await evalExp('(1..5) contains 6', ctx)).to.equal(false)
      expect(await evalExp('"<=" == "<="', ctx)).to.equal(true)
    })

    describe('complex expression', function () {
      it('should support value or value', async function () {
        expect(await evalExp('false or true', ctx)).to.equal(true)
      })
      it('should support < and contains', async function () {
        expect(await evalExp('1<2 and x contains "x"', ctx)).to.equal(false)
      })
      it('should support < or contains', async function () {
        expect(await evalExp('1<2 or x contains "x"', ctx)).to.equal(true)
      })
      it('should support value and !=', async function () {
        expect(await evalExp('empty and empty != ""', ctx)).to.equal(false)
      })
    })

    it('should eval range expression', async function () {
      expect(await evalExp('(2..4)', ctx)).to.deep.equal([2, 3, 4])
      expect(await evalExp('(two..4)', ctx)).to.deep.equal([2, 3, 4])
    })
  })
})
