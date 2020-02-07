import { Expression } from '../../../src/render/expression'
import { expect } from 'chai'
import { Context } from '../../../src/context/context'
import { toThenable } from '../../../src/util/async'

describe('Expression', function () {
  let ctx: Context

  beforeEach(function () {
    ctx = new Context({
      one: 1,
      two: 2,
      empty: '',
      quote: '"',
      space: ' ',
      x: 'XXX',
      y: undefined,
      z: null,
      obj: {
        ']': 'right bracket'
      }
    })
  })

  it('should throw when context not defined', done => {
    toThenable(new Expression().value(undefined!)).catch(err => {
      expect(err.message).to.match(/context not defined/)
      done()
      return 0 as any
    })
  })

  it('should eval simple expression', async function () {
    expect(await toThenable(new Expression('1==2').value(ctx))).to.equal(false)
    expect(await toThenable(new Expression('1<2').value(ctx))).to.equal(true)
    expect(await toThenable(new Expression('1 < 2').value(ctx))).to.equal(true)
    expect(await toThenable(new Expression('1   <   2').value(ctx))).to.equal(true)
    expect(await toThenable(new Expression('2 <= 2').value(ctx))).to.equal(true)
    expect(await toThenable(new Expression('one <= two').value(ctx))).to.equal(true)
    expect(await toThenable(new Expression('x contains "x"').value(ctx))).to.equal(false)
    expect(await toThenable(new Expression('x contains "X"').value(ctx))).to.equal(true)
    expect(await toThenable(new Expression('1 contains "x"').value(ctx))).to.equal(false)
    expect(await toThenable(new Expression('y contains "x"').value(ctx))).to.equal(false)
    expect(await toThenable(new Expression('z contains "x"').value(ctx))).to.equal(false)
    expect(await toThenable(new Expression('(1..5) contains 3').value(ctx))).to.equal(true)
    expect(await toThenable(new Expression('(1..5) contains 6').value(ctx))).to.equal(false)
    expect(await toThenable(new Expression('"<=" == "<="').value(ctx))).to.equal(true)
  })

  it('should allow space in quoted value', async function () {
    expect(await toThenable(new Expression('" " == space').value(ctx))).to.equal(true)
  })

  describe('escape', () => {
    it('should escape quote', async function () {
      expect(await toThenable(new Expression('"\\"" == quote').value(ctx))).to.equal(true)
    })
    it('should escape square bracket', async function () {
      expect(await toThenable(new Expression('obj["]"] == "right bracket"').value(ctx))).to.equal(true)
    })
  })

  describe('complex expression', function () {
    it('should support value or value', async function () {
      expect(await toThenable(new Expression('false or true').value(ctx))).to.equal(true)
    })
    it('should support < and contains', async function () {
      expect(await toThenable(new Expression('1 < 2 and x contains "x"').value(ctx))).to.equal(false)
    })
    it('should support < or contains', async function () {
      expect(await toThenable(new Expression('1 < 2 or x contains "x"').value(ctx))).to.equal(true)
    })
    it('should support value and !=', async function () {
      expect(await toThenable(new Expression('empty and empty != ""').value(ctx))).to.equal(false)
    })
    it('should recognize quoted value', async function () {
      expect(await toThenable(new Expression('">"').value(ctx))).to.equal('>')
    })
    it('should evaluate from right to left', async function () {
      expect(await toThenable(new Expression('true or false and false').value(ctx))).to.equal(true)
      expect(await toThenable(new Expression('true and false and false or true').value(ctx))).to.equal(false)
    })
    it('should recognize property access', async function () {
      const ctx = new Context({ obj: { foo: true } })
      expect(await toThenable(new Expression('obj["foo"] and true').value(ctx))).to.equal(true)
    })
  })

  it('should eval range expression', async function () {
    expect(await toThenable(new Expression('(2..4)').value(ctx))).to.deep.equal([2, 3, 4])
    expect(await toThenable(new Expression('(two..4)').value(ctx))).to.deep.equal([2, 3, 4])
  })
})
