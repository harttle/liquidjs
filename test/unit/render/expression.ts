import { Expression } from '../../../src/render/expression'
import { expect } from 'chai'
import { Context } from '../../../src/context/context'
import { toThenable } from '../../../src/util/async'
import { defaultOperators } from '../../../src/render/operator'

describe('Expression', function () {
  const ctx = new Context({})

  it('should throw when context not defined', done => {
    toThenable(new Expression('foo', defaultOperators).value(undefined!))
      .then(() => done(new Error('should not resolved')))
      .catch(err => {
        expect(err.message).to.match(/context not defined/)
        done()
      })
  })

  describe('single value', function () {
    it('should eval literal', async function () {
      expect(await toThenable(new Expression('2.4', defaultOperators).value(ctx))).to.equal(2.4)
      expect(await toThenable(new Expression('"foo"', defaultOperators).value(ctx))).to.equal('foo')
      expect(await toThenable(new Expression('false', defaultOperators).value(ctx))).to.equal(false)
    })
    it('should eval range expression', async function () {
      const ctx = new Context({ two: 2 })
      expect(await toThenable(new Expression('(2..4)', defaultOperators).value(ctx))).to.deep.equal([2, 3, 4])
      expect(await toThenable(new Expression('(two..4)', defaultOperators).value(ctx))).to.deep.equal([2, 3, 4])
    })
    it('should eval literal', async function () {
      expect(await toThenable(new Expression('2.4', defaultOperators).value(ctx))).to.equal(2.4)
      expect(await toThenable(new Expression('"foo"', defaultOperators).value(ctx))).to.equal('foo')
      expect(await toThenable(new Expression('false', defaultOperators).value(ctx))).to.equal(false)
    })

    it('should eval property access', async function () {
      const ctx = new Context({
        foo: { bar: 'BAR' },
        coo: 'bar',
        doo: { foo: 'bar', bar: { foo: 'bar' } }
      })
      expect(await toThenable(new Expression('foo.bar', defaultOperators).value(ctx))).to.equal('BAR')
      expect(await toThenable(new Expression('foo["bar"]', defaultOperators).value(ctx))).to.equal('BAR')
      expect(await toThenable(new Expression('foo[coo]', defaultOperators).value(ctx))).to.equal('BAR')
      expect(await toThenable(new Expression('foo[doo.foo]', defaultOperators).value(ctx))).to.equal('BAR')
      expect(await toThenable(new Expression('foo[doo["foo"]]', defaultOperators).value(ctx))).to.equal('BAR')
      expect(await toThenable(new Expression('doo[coo].foo', defaultOperators).value(ctx))).to.equal('bar')
    })
  })

  describe('simple expression', function () {
    it('should return false for "1==2"', async () => {
      expect(await toThenable(new Expression('1==2', defaultOperators).value(ctx))).to.equal(false)
    })
    it('should return true for "1<2"', async () => {
      expect(await toThenable(new Expression('1<2', defaultOperators).value(ctx))).to.equal(true)
    })
    it('should return true for "1 < 2"', async () => {
      expect(await toThenable(new Expression('1 < 2', defaultOperators).value(ctx))).to.equal(true)
    })
    it('should return true for "1   <   2"', async () => {
      expect(await toThenable(new Expression('1   <   2', defaultOperators).value(ctx))).to.equal(true)
    })
    it('should return true for "2 <= 2"', async () => {
      expect(await toThenable(new Expression('2 <= 2', defaultOperators).value(ctx))).to.equal(true)
    })
    it('should return true for "one <= two"', async () => {
      const ctx = new Context({ one: 1, two: 2 })
      expect(await toThenable(new Expression('one <= two', defaultOperators).value(ctx))).to.equal(true)
    })
    it('should return false for "x contains "x""', async () => {
      const ctx = new Context({ x: 'XXX' })
      expect(await toThenable(new Expression('x contains "x"', defaultOperators).value(ctx))).to.equal(false)
    })
    it('should return true for "x contains "X""', async () => {
      const ctx = new Context({ x: 'XXX' })
      expect(await toThenable(new Expression('x contains "X"', defaultOperators).value(ctx))).to.equal(true)
    })
    it('should return false for "1 contains "x""', async () => {
      const ctx = new Context({ x: 'XXX' })
      expect(await toThenable(new Expression('1 contains "x"', defaultOperators).value(ctx))).to.equal(false)
    })
    it('should return false for "y contains "x""', async () => {
      const ctx = new Context({ x: 'XXX' })
      expect(await toThenable(new Expression('y contains "x"', defaultOperators).value(ctx))).to.equal(false)
    })
    it('should return false for "z contains "x""', async () => {
      const ctx = new Context({ x: 'XXX' })
      expect(await toThenable(new Expression('z contains "x"', defaultOperators).value(ctx))).to.equal(false)
    })
    it('should return true for "(1..5) contains 3"', async () => {
      const ctx = new Context({ x: 'XXX' })
      expect(await toThenable(new Expression('(1..5) contains 3', defaultOperators).value(ctx))).to.equal(true)
    })
    it('should return false for "(1..5) contains 6"', async () => {
      const ctx = new Context({ x: 'XXX' })
      expect(await toThenable(new Expression('(1..5) contains 6', defaultOperators).value(ctx))).to.equal(false)
    })
    it('should return true for ""<=" == "<=""', async () => {
      expect(await toThenable(new Expression('"<=" == "<="', defaultOperators).value(ctx))).to.equal(true)
    })
  })

  it('should allow space in quoted value', async function () {
    const ctx = new Context({ space: ' ' })
    expect(await toThenable(new Expression('" " == space', defaultOperators).value(ctx))).to.equal(true)
  })

  describe('escape', () => {
    it('should escape quote', async function () {
      const ctx = new Context({ quote: '"' })
      expect(await toThenable(new Expression('"\\"" == quote', defaultOperators).value(ctx))).to.equal(true)
    })
    it('should escape square bracket', async function () {
      const ctx = new Context({ obj: { ']': 'bracket' } })
      expect(await toThenable(new Expression('obj["]"] == "bracket"', defaultOperators).value(ctx))).to.equal(true)
    })
  })

  describe('complex expression', function () {
    it('should support value or value', async function () {
      expect(await toThenable(new Expression('false or true', defaultOperators).value(ctx))).to.equal(true)
    })
    it('should support < and contains', async function () {
      expect(await toThenable(new Expression('1 < 2 and x contains "x"', defaultOperators).value(ctx))).to.equal(false)
    })
    it('should support < or contains', async function () {
      expect(await toThenable(new Expression('1 < 2 or x contains "x"', defaultOperators).value(ctx))).to.equal(true)
    })
    it('should support value and !=', async function () {
      const ctx = new Context({ empty: '' })
      expect(await toThenable(new Expression('empty and empty != ""', defaultOperators).value(ctx))).to.equal(false)
    })
    it('should recognize quoted value', async function () {
      expect(await toThenable(new Expression('">"', defaultOperators).value(ctx))).to.equal('>')
    })
    it('should evaluate from right to left', async function () {
      expect(await toThenable(new Expression('true or false and false', defaultOperators).value(ctx))).to.equal(true)
      expect(await toThenable(new Expression('true and false and false or true', defaultOperators).value(ctx))).to.equal(false)
    })
    it('should recognize property access', async function () {
      const ctx = new Context({ obj: { foo: true } })
      expect(await toThenable(new Expression('obj["foo"] and true', defaultOperators).value(ctx))).to.equal(true)
    })
    it('should allow nested property access', async function () {
      const ctx = new Context({ obj: { foo: 'FOO' }, keys: { "what's this": 'foo' } })
      expect(await toThenable(new Expression('obj[keys["what\'s this"]]', defaultOperators).value(ctx))).to.equal('FOO')
    })
  })
})
