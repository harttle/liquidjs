import { Expression } from '../../../src/render/expression'
import { expect } from 'chai'
import { Context } from '../../../src/context/context'

describe('Expression', function () {
  let ctx: Context

  beforeEach(function () {
    ctx = new Context({
      one: 1,
      two: 2,
      empty: '',
      x: 'XXX',
      y: undefined,
      z: null
    })
  })

  it('should throw when context not defined', async function () {
    return expect(() => new Expression().value()).to.throw(/context not defined/)
  })

  it('should eval simple expression', async function () {
    expect(new Expression('1 < 2').value(ctx)).to.equal(true)
    expect(new Expression('2 <= 2').value(ctx)).to.equal(true)
    expect(new Expression('one <= two').value(ctx)).to.equal(true)
    expect(new Expression('x contains "x"').value(ctx)).to.equal(false)
    expect(new Expression('x contains "X"').value(ctx)).to.equal(true)
    expect(new Expression('1 contains "x"').value(ctx)).to.equal(false)
    expect(new Expression('y contains "x"').value(ctx)).to.equal(false)
    expect(new Expression('z contains "x"').value(ctx)).to.equal(false)
    expect(new Expression('(1..5) contains 3').value(ctx)).to.equal(true)
    expect(new Expression('(1..5) contains 6').value(ctx)).to.equal(false)
    expect(new Expression('"<=" == "<="').value(ctx)).to.equal(true)
  })

  describe('complex expression', function () {
    it('should support value or value', async function () {
      expect(new Expression('false or true').value(ctx)).to.equal(true)
    })
    it('should support < and contains', async function () {
      expect(new Expression('1 < 2 and x contains "x"').value(ctx)).to.equal(false)
    })
    it('should support < or contains', async function () {
      expect(new Expression('1 < 2 or x contains "x"').value(ctx)).to.equal(true)
    })
    it('should support value and !=', async function () {
      expect(new Expression('empty and empty != ""').value(ctx)).to.equal(false)
    })
    it('should recognize quoted value', async function () {
      expect(new Expression('">"').value(ctx)).to.equal('>')
    })
    it('should evaluate from right to left', function () {
      expect(new Expression('true or false and false').value(ctx)).to.equal(true)
      expect(new Expression('true and false and false or true').value(ctx)).to.equal(false)
    })
    it('should recognize property access', function () {
      const ctx = new Context({ obj: { foo: true } })
      expect(new Expression('obj["foo"] and true').value(ctx)).to.equal(true)
    })
  })

  it('should eval range expression', async function () {
    expect(new Expression('(2..4)').value(ctx)).to.deep.equal([2, 3, 4])
    expect(new Expression('(two..4)').value(ctx)).to.deep.equal([2, 3, 4])
  })
})
