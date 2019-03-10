import Scope from '../../../src/scope/scope'
import { expect } from 'chai'
import { evalExp, evalValue, isTruthy } from '../../../src/render/syntax'

describe('render/syntax', function () {
  let scope: Scope

  beforeEach(function () {
    scope = new Scope({
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
      expect(await evalValue('true', scope)).to.equal(true)
      expect(await evalValue('TrUE', scope)).to.equal(undefined)
      expect(await evalValue('false', scope)).to.equal(false)
    })
    it('should eval number literal', async function () {
      expect(await evalValue('2.3', scope)).to.equal(2.3)
      expect(await evalValue('.32', scope)).to.equal(0.32)
      expect(await evalValue('-23.', scope)).to.equal(-23)
      expect(await evalValue('23', scope)).to.equal(23)
    })
    it('should eval string literal', async function () {
      expect(await evalValue('"ab\'c"', scope)).to.equal("ab'c")
      expect(await evalValue("'ab\"c'", scope)).to.equal('ab"c')
    })
    it('should eval nil literal', async function () {
      expect(await evalValue('nil', scope)).to.be.null
    })
    it('should eval null literal', async function () {
      expect(await evalValue('null', scope)).to.be.null
    })
    it('should eval scope variables', async function () {
      expect(await evalValue('one', scope)).to.equal(1)
      expect(await evalValue('has_value?', scope)).to.equal(true)
      expect(await evalValue('x', scope)).to.equal('XXX')
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
      return expect((evalExp as any)('')).to.be.rejectedWith(/scope undefined/)
    })

    it('should eval simple expression', async function () {
      expect(await evalExp('1<2', scope)).to.equal(true)
      expect(await evalExp('2<=2', scope)).to.equal(true)
      expect(await evalExp('one<=two', scope)).to.equal(true)
      expect(await evalExp('x contains "x"', scope)).to.equal(false)
      expect(await evalExp('x contains "X"', scope)).to.equal(true)
      expect(await evalExp('1 contains "x"', scope)).to.equal(false)
      expect(await evalExp('y contains "x"', scope)).to.equal(false)
      expect(await evalExp('z contains "x"', scope)).to.equal(false)
      expect(await evalExp('(1..5) contains 3', scope)).to.equal(true)
      expect(await evalExp('(1..5) contains 6', scope)).to.equal(false)
      expect(await evalExp('"<=" == "<="', scope)).to.equal(true)
    })

    describe('complex expression', function () {
      it('should support value or value', async function () {
        expect(await evalExp('false or true', scope)).to.equal(true)
      })
      it('should support < and contains', async function () {
        expect(await evalExp('1<2 and x contains "x"', scope)).to.equal(false)
      })
      it('should support < or contains', async function () {
        expect(await evalExp('1<2 or x contains "x"', scope)).to.equal(true)
      })
      it('should support value and !=', async function () {
        expect(await evalExp('empty and empty != ""', scope)).to.equal(false)
      })
    })

    it('should eval range expression', async function () {
      expect(await evalExp('(2..4)', scope)).to.deep.equal([2, 3, 4])
      expect(await evalExp('(two..4)', scope)).to.deep.equal([2, 3, 4])
    })
  })
})
