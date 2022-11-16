import { Tokenizer } from '../../../src/parser/tokenizer'
import { expect } from 'chai'
import { Drop } from '../../../src/drop/drop'
import { Context } from '../../../src/context/context'
import { toPromise, toValueSync } from '../../../src/util/async'

describe('Expression', function () {
  const ctx = new Context({})
  const create = (str: string) => new Tokenizer(str).readExpression()

  it('should throw when context not defined', done => {
    toPromise(create('foo').evaluate(undefined!, false))
      .then(() => done(new Error('should not resolved')))
      .catch(err => {
        expect(err.message).to.match(/context not defined/)
        done()
      })
  })

  describe('single value', function () {
    it('should eval literal', async function () {
      expect(await toPromise(create('2.4').evaluate(ctx, false))).to.equal(2.4)
      expect(await toPromise(create('"foo"').evaluate(ctx, false))).to.equal('foo')
      expect(await toPromise(create('false').evaluate(ctx, false))).to.equal(false)
    })
    it('should eval range expression', async function () {
      const ctx = new Context({ two: 2 })
      expect(await toPromise(create('(2..4)').evaluate(ctx, false))).to.deep.equal([2, 3, 4])
      expect(await toPromise(create('(two..4)').evaluate(ctx, false))).to.deep.equal([2, 3, 4])
    })
    it('should eval literal', async function () {
      expect(await toPromise(create('2.4').evaluate(ctx, false))).to.equal(2.4)
      expect(await toPromise(create('"foo"').evaluate(ctx, false))).to.equal('foo')
      expect(await toPromise(create('false').evaluate(ctx, false))).to.equal(false)
    })

    it('should eval property access', async function () {
      const ctx = new Context({
        foo: { bar: 'BAR' },
        coo: 'bar',
        doo: { foo: 'bar', bar: { foo: 'bar' } }
      })
      expect(await toPromise(create('foo.bar').evaluate(ctx, false))).to.equal('BAR')
      expect(await toPromise(create('foo["bar"]').evaluate(ctx, false))).to.equal('BAR')
      expect(await toPromise(create('foo[coo]').evaluate(ctx, false))).to.equal('BAR')
      expect(await toPromise(create('foo[doo.foo]').evaluate(ctx, false))).to.equal('BAR')
      expect(await toPromise(create('foo[doo["foo"]]').evaluate(ctx, false))).to.equal('BAR')
      expect(await toPromise(create('doo[coo].foo').evaluate(ctx, false))).to.equal('bar')
    })
  })

  describe('simple expression', function () {
    it('should return false for "1==2"', async () => {
      expect(await toPromise(create('1==2').evaluate(ctx, false))).to.equal(false)
    })
    it('should return true for "1<2"', async () => {
      expect(await toPromise(create('1<2').evaluate(ctx, false))).to.equal(true)
    })
    it('should return true for "1 < 2"', async () => {
      expect(await toPromise(create('1 < 2').evaluate(ctx, false))).to.equal(true)
    })
    it('should return true for "1   <   2"', async () => {
      expect(await toPromise(create('1   <   2').evaluate(ctx, false))).to.equal(true)
    })
    it('should return true for "2 <= 2"', async () => {
      expect(await toPromise(create('2 <= 2').evaluate(ctx, false))).to.equal(true)
    })
    it('should return true for "one <= two"', async () => {
      const ctx = new Context({ one: 1, two: 2 })
      expect(await toPromise(create('one <= two').evaluate(ctx, false))).to.equal(true)
    })
    it('should return false for "x contains "x""', async () => {
      const ctx = new Context({ x: 'XXX' })
      expect(await toPromise(create('x contains "x"').evaluate(ctx, false))).to.equal(false)
    })
    it('should return true for "x contains "X""', async () => {
      const ctx = new Context({ x: 'XXX' })
      expect(await toPromise(create('x contains "X"').evaluate(ctx, false))).to.equal(true)
    })
    it('should return false for "1 contains "x""', async () => {
      const ctx = new Context({ x: 'XXX' })
      expect(await toPromise(create('1 contains "x"').evaluate(ctx, false))).to.equal(false)
    })
    it('should return false for "y contains "x""', async () => {
      const ctx = new Context({ x: 'XXX' })
      expect(await toPromise(create('y contains "x"').evaluate(ctx, false))).to.equal(false)
    })
    it('should return false for "z contains "x""', async () => {
      const ctx = new Context({ x: 'XXX' })
      expect(await toPromise(create('z contains "x"').evaluate(ctx, false))).to.equal(false)
    })
    it('should return true for "(1..5) contains 3"', async () => {
      const ctx = new Context({ x: 'XXX' })
      expect(await toPromise(create('(1..5) contains 3').evaluate(ctx, false))).to.equal(true)
    })
    it('should return false for "(1..5) contains 6"', async () => {
      const ctx = new Context({ x: 'XXX' })
      expect(await toPromise(create('(1..5) contains 6').evaluate(ctx, false))).to.equal(false)
    })
    it('should return true for ""<=" == "<=""', async () => {
      expect(await toPromise(create('"<=" == "<="').evaluate(ctx, false))).to.equal(true)
    })
  })

  it('should allow space in quoted value', async function () {
    const ctx = new Context({ space: ' ' })
    expect(await toPromise(create('" " == space').evaluate(ctx, false))).to.equal(true)
  })

  describe('escape', () => {
    it('should escape quote', async function () {
      const ctx = new Context({ quote: '"' })
      expect(await toPromise(create('"\\"" == quote').evaluate(ctx, false))).to.equal(true)
    })
    it('should escape square bracket', async function () {
      const ctx = new Context({ obj: { ']': 'bracket' } })
      expect(await toPromise(create('obj["]"] == "bracket"').evaluate(ctx, false))).to.equal(true)
    })
  })

  describe('complex expression', function () {
    it('should support value or value', async function () {
      expect(await toPromise(create('false or true').evaluate(ctx, false))).to.equal(true)
    })
    it('should support < and contains', async function () {
      expect(await toPromise(create('1 < 2 and x contains "x"').evaluate(ctx, false))).to.equal(false)
    })
    it('should support < or contains', async function () {
      expect(await toPromise(create('1 < 2 or x contains "x"').evaluate(ctx, false))).to.equal(true)
    })
    it('should support Drops for "x contains "x""', async () => {
      class TemplateDrop extends Drop {
        valueOf () { return 'X' }
      }
      const ctx = new Context({ x: 'XXX', X: new TemplateDrop() })
      expect(await toPromise(create('x contains X').evaluate(ctx, false))).to.equal(true)
    })
    it('should support value and !=', async function () {
      const ctx = new Context({ empty: '' })
      expect(await toPromise(create('empty and empty != ""').evaluate(ctx, false))).to.equal(false)
    })
    it('should recognize quoted value', async function () {
      expect(await toPromise(create('">"').evaluate(ctx, false))).to.equal('>')
    })
    it('should evaluate from right to left', async function () {
      expect(await toPromise(create('true or false and false').evaluate(ctx, false))).to.equal(true)
      expect(await toPromise(create('true and false and false or true').evaluate(ctx, false))).to.equal(false)
    })
    it('should recognize property access', async function () {
      const ctx = new Context({ obj: { foo: true } })
      expect(await toPromise(create('obj["foo"] and true').evaluate(ctx, false))).to.equal(true)
    })
    it('should allow nested property access', async function () {
      const ctx = new Context({ obj: { foo: 'FOO' }, keys: { "what's this": 'foo' } })
      expect(await toPromise(create('obj[keys["what\'s this"]]').evaluate(ctx, false))).to.equal('FOO')
    })
  })

  describe('sync', function () {
    it('should eval literal', function () {
      expect(toValueSync(create('2.4').evaluate(ctx, false))).to.equal(2.4)
    })
    it('should return false for "1==2"', () => {
      expect(toValueSync(create('1==2').evaluate(ctx, false))).to.equal(false)
    })
    it('should escape quote', function () {
      const ctx = new Context({ quote: '"' })
      expect(toValueSync(create('"\\"" == quote').evaluate(ctx, false))).to.equal(true)
    })
    it('should allow nested property access', function () {
      const ctx = new Context({ obj: { foo: 'FOO' }, keys: { "what's this": 'foo' } })
      expect(toValueSync(create('obj[keys["what\'s this"]]').evaluate(ctx, false))).to.equal('FOO')
    })
  })
})
