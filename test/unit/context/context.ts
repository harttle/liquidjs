import * as chai from 'chai'
import Context from '../../../src/context/context'
import { Scope } from '../../../src/context/scope'

const expect = chai.expect

describe('scope', function () {
  let ctx: any, scope: Scope
  beforeEach(function () {
    scope = {
      foo: 'zoo',
      one: 1,
      zoo: { size: 4 },
      bar: {
        zoo: 'coo',
        'Mr.Smith': 'John',
        arr: ['a', 'b']
      }
    }
    ctx = new Context(scope)
  })

  describe('#propertyAccessSeq()', function () {
    it('should handle dot syntax', async function () {
      expect(await ctx.parseProp('foo.bar'))
        .to.deep.equal(['foo', 'bar'])
    })
    it('should handle [<String>] syntax', async function () {
      expect(await ctx.parseProp('foo["bar"]'))
        .to.deep.equal(['foo', 'bar'])
    })
    it('should handle [<Identifier>] syntax', async function () {
      expect(await ctx.parseProp('foo[foo]'))
        .to.deep.equal(['foo', 'zoo'])
    })
    it('should handle nested access 1', async function () {
      expect(await ctx.parseProp('foo[bar.zoo]'))
        .to.deep.equal(['foo', 'coo'])
    })
    it('should handle nested access 2', async function () {
      expect(await ctx.parseProp('foo[bar["zoo"]]'))
        .to.deep.equal(['foo', 'coo'])
    })
    it('should handle nested access 3', async function () {
      expect(await ctx.parseProp('bar["foo"].zoo'))
        .to.deep.equal(['bar', 'foo', 'zoo'])
    })
    it('should handle nested access 4', async function () {
      expect(await ctx.parseProp('foo[0].bar'))
        .to.deep.equal(['foo', '0', 'bar'])
    })
    it('should handle nested access 5', async function () {
      expect(await ctx.parseProp('foo[one].bar'))
        .to.deep.equal(['foo', '1', 'bar'])
    })
    it('should handle nested access 6', async function () {
      expect(await ctx.parseProp('foo[two].bar'))
        .to.deep.equal(['foo', 'undefined', 'bar'])
    })
  })

  describe('#get()', function () {
    it('should get direct property', async function () {
      expect(await await ctx.get('foo')).equal('zoo')
    })

    it('undefined property should yield undefined', async function () {
      expect(ctx.get('notdefined')).to.be.rejected
      expect(await ctx.get('notdefined')).to.equal(undefined)
      expect(await ctx.get(false as any)).to.equal(undefined)
    })

    it('should throw for invalid path', async function () {
      expect(ctx.get('')).to.be.rejectedWith('invalid path:""')
    })

    it('should throw when [] unbalanced', async function () {
      expect(ctx.get('foo[bar')).to.be.rejectedWith(/unbalanced \[\]/)
    })

    it('should throw when "" unbalanced', async function () {
      expect(ctx.get('foo["bar]')).to.be.rejectedWith(/unbalanced "/)
    })

    it("should throw when '' unbalanced", async function () {
      expect(ctx.get("foo['bar]")).to.be.rejectedWith(/unbalanced '/)
    })
    it('should respect to toLiquid', async function () {
      const scope = new Context({ foo: {
        toLiquid: () => ({ bar: 'BAR' }),
        bar: 'bar'
      } })
      expect(await scope.get('foo.bar')).to.equal('BAR')
    })

    it('should access child property via dot syntax', async function () {
      expect(await ctx.get('bar.zoo')).to.equal('coo')
      expect(await ctx.get('bar.arr')).to.deep.equal(['a', 'b'])
    })

    it('should access child property via [<String>] syntax', async function () {
      expect(await ctx.get('bar["zoo"]')).to.equal('coo')
    })

    it('should access child property via [<Number>] syntax', async function () {
      expect(await ctx.get('bar.arr[0]')).to.equal('a')
    })

    it('should access child property via [<Identifier>] syntax', async function () {
      expect(await ctx.get('bar[foo]')).to.equal('coo')
    })

    it('should return undefined when not exist', async function () {
      expect(await ctx.get('foo.foo.foo')).to.be.undefined
    })
    it('should return string length as size', async function () {
      expect(await ctx.get('foo.size')).to.equal(3)
    })
    it('should return array length as size', async function () {
      expect(await ctx.get('bar.arr.size')).to.equal(2)
    })
    it('should return size property if exists', async function () {
      expect(await ctx.get('zoo.size')).to.equal(4)
    })
    it('should return undefined if do not have size and length', async function () {
      expect(await ctx.get('one.size')).to.equal(undefined)
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
      return expect(ctx.get('notdefined')).to.be.rejectedWith(/undefined variable: notdefined/)
    })
    it('should throw when deep variable not exist', async function () {
      ctx.push({ foo: 'FOO' })
      return expect(ctx.get('foo.bar.not.defined')).to.be.rejectedWith(/undefined variable: bar/)
    })
    it('should throw when itself not defined', async function () {
      ctx.push({ foo: 'FOO' })
      return expect(ctx.get('foo.BAR')).to.be.rejectedWith(/undefined variable: BAR/)
    })
    it('should find variable in parent scope', async function () {
      ctx.push({ 'foo': 'foo' })
      ctx.push({
        'bar': 'bar'
      })
      expect(await ctx.get('foo')).to.equal('foo')
    })
  })

  describe('.getAll()', function () {
    it('should get all properties when arguments empty', async function () {
      expect(await ctx.getAll()).deep.equal(scope)
    })
  })

  describe('.push()', function () {
    it('should push scope', async function () {
      ctx.push({ 'bar': 'bar' })
      ctx.push({
        foo: 'foo'
      })
      expect(await ctx.get('foo')).to.equal('foo')
      expect(await ctx.get('bar')).to.equal('bar')
    })
    it('should hide deep properties by push', async function () {
      ctx.push({ bar: { bar: 'bar' } })
      ctx.push({ bar: { foo: 'foo' } })
      expect(await ctx.get('bar.foo')).to.equal('foo')
      expect(await ctx.get('bar.bar')).to.equal(undefined)
    })
  })
  describe('.pop()', function () {
    it('should pop scope', async function () {
      ctx.push({
        foo: 'foo'
      })
      ctx.pop()
      expect(await ctx.get('foo')).to.equal('zoo')
    })
  })
})
