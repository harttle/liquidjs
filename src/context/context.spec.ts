import { Context } from './context'
import { Scope } from './scope'

describe('Context', function () {
  let ctx: any, scope: Scope
  beforeEach(function () {
    scope = {
      foo: 'zoo',
      one: 1,
      zoo: { size: 4 },
      map: new Map([['foo', 'FOO']]),
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
      },
      arr: ['a', 'b', 'c', 'd']
    }
    ctx = new Context(scope)
  })

  describe('#get()', function () {
    it('should get direct property', async function () {
      expect(ctx.get(['foo'])).toEqual('zoo')
    })
    it('should read nested property', async function () {
      expect(ctx.get(['obj', 'first'])).toEqual('f')
      expect(ctx.get(['obj', 'last'])).toEqual('l')
      expect(ctx.get(['obj', 'size'])).toEqual(2)
    })
    it('undefined property should yield undefined', async function () {
      expect(ctx.get(['notdefined'])).toEqual(undefined)
      expect(ctx.get([false as any])).toEqual(undefined)
    })
    it('should respect to toLiquid', async function () {
      const scope = new Context({ foo: {
        toLiquid: () => ({ bar: 'BAR' }),
        bar: 'bar'
      } })
      // eslint-disable-next-line deprecation/deprecation
      expect(scope.get(['foo', 'bar'])).toEqual('BAR')
    })
    it('should return undefined when not exist', async function () {
      expect(ctx.get(['foo', 'foo', 'foo'])).toBeUndefined()
    })
    it('should return string length as size', async function () {
      expect(ctx.get(['foo', 'size'])).toEqual(3)
    })
    it('should return array length as size', async function () {
      expect(ctx.get(['bar', 'arr', 'size'])).toEqual(2)
    })
    it('should return map size as size', async function () {
      expect(ctx.get(['map', 'size'])).toEqual(1)
    })
    it('should return undefined if not have a size', async function () {
      expect(ctx.get(['one', 'size'])).toBeUndefined()
      expect(ctx.get(['non-exist', 'size'])).toBeUndefined()
    })
    it('should read .first of array', async function () {
      expect(ctx.get(['bar', 'arr', 'first'])).toEqual('a')
    })
    it('should read .last of array', async function () {
      expect(ctx.get(['bar', 'arr', 'last'])).toEqual('b')
    })
    it('should read element of array', async function () {
      expect(ctx.get(['arr', 1])).toEqual('b')
    })
    it('should read element of array from end', async function () {
      expect(ctx.get(['arr', -2])).toEqual('c')
    })
    it('should call function', async function () {
      expect(ctx.get(['func'])).toEqual('FUNC')
    })
    it('should call function before read nested property', async function () {
      expect(ctx.get(['objFunc', 'prop'])).toEqual('PROP')
    })
  })

  describe('#getFromScope()', function () {
    it('should support string', () => {
      expect(ctx.getFromScope({ obj: { foo: 'FOO' } }, 'obj.foo')).toEqual('FOO')
    })
  })

  describe('strictVariables', function () {
    let ctx: Context
    beforeEach(function () {
      ctx = new Context(ctx, {
        strictVariables: true
      } as any)
    })
    it('should throw when variable not defined', function () {
      return expect(() => ctx.getSync(['notdefined'])).toThrow(/undefined variable: notdefined/)
    })
    it('should throw when deep variable not exist', async function () {
      ctx.push({ foo: 'FOO' })
      return expect(() => ctx.getSync(['foo', 'bar', 'not', 'defined'])).toThrow(/undefined variable: foo.bar/)
    })
    it('should throw when itself not defined', async function () {
      ctx.push({ foo: 'FOO' })
      return expect(() => ctx.getSync(['foo', 'BAR'])).toThrow(/undefined variable: foo.BAR/)
    })
    it('should find variable in parent scope', async function () {
      ctx.push({ 'foo': 'foo' })
      ctx.push({
        'bar': 'bar'
      })
      expect(ctx.getSync(['foo'])).toEqual('foo')
    })
  })

  describe('ownPropertyOnly', function () {
    let ctx: Context
    beforeEach(function () {
      ctx = new Context(ctx, {
        ownPropertyOnly: true
      } as any)
    })
    it('should return undefined for prototype object property', function () {
      ctx.push({ foo: Object.create({ bar: 'BAR' }) })
      return expect(ctx.getSync(['foo', 'bar'])).toEqual(undefined)
    })
    it('should use prototype when ownPropertyOnly=false', function () {
      ctx = new Context({ foo: Object.create({ bar: 'BAR' }) }, { ownPropertyOnly: false } as any)
      return expect(ctx.getSync(['foo', 'bar'])).toEqual('BAR')
    })
    it('renderOptions.ownPropertyOnly should override options.ownPropertyOnly', function () {
      ctx = new Context({ foo: Object.create({ bar: 'BAR' }) }, { ownPropertyOnly: false } as any, { ownPropertyOnly: true })
      return expect(ctx.getSync(['foo', 'bar'])).toEqual(undefined)
    })
    it('should return undefined for Array.prototype.reduce', function () {
      ctx.push({ foo: [] })
      return expect(ctx.getSync(['foo', 'reduce'])).toEqual(undefined)
    })
    it('should return undefined for function prototype property', function () {
      function Foo () {}
      Foo.prototype.bar = 'BAR'
      ctx.push({ foo: new (Foo as any)() })
      return expect(ctx.getSync(['foo', 'bar'])).toEqual(undefined)
    })
    it('should allow function constructor properties', function () {
      function Foo (this: any) { this.bar = 'BAR' }
      ctx.push({ foo: new (Foo as any)() })
      return expect(ctx.getSync(['foo', 'bar'])).toEqual('BAR')
    })
    it('should return undefined for class method', function () {
      class Foo { bar () {} }
      ctx.push({ foo: new Foo() })
      return expect(ctx.getSync(['foo', 'bar'])).toEqual(undefined)
    })
    it('should allow class property', function () {
      class Foo { bar = 'BAR' }
      ctx.push({ foo: new Foo() })
      return expect(ctx.getSync(['foo', 'bar'])).toEqual('BAR')
    })
    it('should allow Array.prototype.length', function () {
      ctx.push({ foo: [1, 2] })
      return expect(ctx.getSync(['foo', 'length'])).toEqual(2)
    })
    it('should allow size to access Array.prototype.length', function () {
      ctx.push({ foo: [1, 2] })
      return expect(ctx.getSync(['foo', 'size'])).toEqual(2)
    })
    it('should allow size to access Set.prototype.size', function () {
      ctx.push({ foo: new Set([1, 2]) })
      return expect(ctx.getSync(['foo', 'size'])).toEqual(2)
    })
    it('should allow size to access Object key count', function () {
      ctx.push({ foo: { bar: 'BAR', coo: 'COO' } })
      return expect(ctx.getSync(['foo', 'size'])).toEqual(2)
    })
    it('should throw when property is hidden and strictVariables is true', function () {
      ctx = new Context(ctx, {
        ownPropertyOnly: true,
        strictVariables: true
      } as any)
      ctx.push({ foo: Object.create({ bar: 'BAR' }) })
      return expect(() => ctx.getSync(['foo', 'bar'])).toThrow(/undefined variable: foo.bar/)
    })
  })

  describe('.getAll()', function () {
    it('should get all properties when arguments empty', async function () {
      expect(ctx.getAll()).toEqual(scope)
    })
  })

  describe('.push()', function () {
    it('should push scope', async function () {
      ctx.push({ 'bar': 'bar' })
      ctx.push({
        foo: 'foo'
      })
      expect(ctx.getSync(['foo'])).toEqual('foo')
      expect(ctx.getSync(['bar'])).toEqual('bar')
    })
    it('should hide deep properties by push', async function () {
      ctx.push({ bar: { bar: 'bar' } })
      ctx.push({ bar: { foo: 'foo' } })
      expect(ctx.getSync(['bar', 'foo'])).toEqual('foo')
      expect(ctx.getSync(['bar', 'bar'])).toEqual(undefined)
    })
  })
  describe('.pop()', function () {
    it('should pop scope', async function () {
      ctx.push({
        foo: 'foo'
      })
      ctx.pop()
      expect(ctx.getSync(['foo'])).toEqual('zoo')
    })
  })
})
