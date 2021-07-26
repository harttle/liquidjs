import * as chai from 'chai'
import { Context } from '../../../src/context/context'
import { Scope } from '../../../src/context/scope'

const expect = chai.expect

describe('Context', function () {
  let ctx: any, scope: Scope
  beforeEach(function () {
    scope = {
      foo: 'zoo',
      one: 1,
      zoo: { size: 4 },
      obj: {
        first: 'f',
        last: 'l'
      },
      func: () => 'FUNC',
      objFunc: () => ({ prop: 'PROP' }),
      bar: {
        zoo: 'coo',
        'Mr.Smith': 'John',
        arr: ['a', 'b']
      }
    }
    ctx = new Context(scope)
  })

  describe('#get()', function () {
    it('should get direct property', async function () {
      expect(ctx.get(['foo'])).equal('zoo')
    })
    it('should read nested property', async function () {
      expect(ctx.get(['obj', 'first'])).to.equal('f')
      expect(ctx.get(['obj', 'last'])).to.equal('l')
      expect(ctx.get(['obj', 'size'])).to.equal(undefined)
    })
    it('undefined property should yield undefined', async function () {
      expect(ctx.get(['notdefined'])).to.equal(undefined)
      expect(ctx.get([false as any])).to.equal(undefined)
    })
    it('should respect to toLiquid', async function () {
      const scope = new Context({ foo: {
        toLiquid: () => ({ bar: 'BAR' }),
        bar: 'bar'
      } })
      expect(scope.get(['foo', 'bar'])).to.equal('BAR')
    })
    it('should return undefined when not exist', async function () {
      expect(ctx.get(['foo', 'foo', 'foo'])).to.be.undefined
    })
    it('should return string length as size', async function () {
      expect(ctx.get(['foo', 'size'])).to.equal(3)
    })
    it('should return array length as size', async function () {
      expect(ctx.get(['bar', 'arr', 'size'])).to.equal(2)
    })
    it('should read .first of array', async function () {
      expect(ctx.get(['bar', 'arr', 'first'])).to.equal('a')
    })
    it('should read .last of array', async function () {
      expect(ctx.get(['bar', 'arr', 'last'])).to.equal('b')
    })
    it('should call function', async function () {
      expect(ctx.get(['func'])).to.equal('FUNC')
    })
    it('should call function before read nested property', async function () {
      expect(ctx.get(['objFunc', 'prop'])).to.equal('PROP')
    })
  })

  describe('#getFromScope()', function () {
    it('should support string', () => {
      expect(ctx.getFromScope({ obj: { foo: 'FOO' } }, 'obj.foo')).to.equal('FOO')
    })
  })

  describe('strictVariables', async function () {
    let ctx: Context
    beforeEach(function () {
      ctx = new Context(ctx, {
        strictVariables: true
      } as any)
    })
    it('should throw when variable not defined', function () {
      return expect(() => ctx.get(['notdefined'])).to.throw(/undefined variable: notdefined/)
    })
    it('should throw when deep variable not exist', async function () {
      ctx.push({ foo: 'FOO' })
      return expect(() => ctx.get(['foo', 'bar', 'not', 'defined'])).to.throw(/undefined variable: bar/)
    })
    it('should throw when itself not defined', async function () {
      ctx.push({ foo: 'FOO' })
      return expect(() => ctx.get(['foo', 'BAR'])).to.throw(/undefined variable: BAR/)
    })
    it('should find variable in parent scope', async function () {
      ctx.push({ 'foo': 'foo' })
      ctx.push({
        'bar': 'bar'
      })
      expect(ctx.get(['foo'])).to.equal('foo')
    })
  })

  describe('.getAll()', function () {
    it('should get all properties when arguments empty', async function () {
      expect(ctx.getAll()).deep.equal(scope)
    })
  })

  describe('.push()', function () {
    it('should push scope', async function () {
      ctx.push({ 'bar': 'bar' })
      ctx.push({
        foo: 'foo'
      })
      expect(ctx.get(['foo'])).to.equal('foo')
      expect(ctx.get(['bar'])).to.equal('bar')
    })
    it('should hide deep properties by push', async function () {
      ctx.push({ bar: { bar: 'bar' } })
      ctx.push({ bar: { foo: 'foo' } })
      expect(ctx.get(['bar', 'foo'])).to.equal('foo')
      expect(ctx.get(['bar', 'bar'])).to.equal(undefined)
    })
  })
  describe('.pop()', function () {
    it('should pop scope', async function () {
      ctx.push({
        foo: 'foo'
      })
      ctx.pop()
      expect(ctx.get(['foo'])).to.equal('zoo')
    })
  })
})
