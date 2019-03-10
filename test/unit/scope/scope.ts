import * as chai from 'chai'
import Scope from '../../../src/scope/scope'
import { Context } from '../../../src/scope/context'

const expect = chai.expect

describe('scope', function () {
  let scope: Scope, ctx: Context
  beforeEach(function () {
    ctx = {
      foo: 'zoo',
      one: 1,
      zoo: { size: 4 },
      bar: {
        zoo: 'coo',
        'Mr.Smith': 'John',
        arr: ['a', 'b']
      }
    }
    scope = new Scope(ctx)
  })

  describe('#propertyAccessSeq()', function () {
    it('should handle dot syntax', async function () {
      expect(await scope.propertyAccessSeq('foo.bar'))
        .to.deep.equal(['foo', 'bar'])
    })
    it('should handle [<String>] syntax', async function () {
      expect(await scope.propertyAccessSeq('foo["bar"]'))
        .to.deep.equal(['foo', 'bar'])
    })
    it('should handle [<Identifier>] syntax', async function () {
      expect(await scope.propertyAccessSeq('foo[foo]'))
        .to.deep.equal(['foo', 'zoo'])
    })
    it('should handle nested access 1', async function () {
      expect(await scope.propertyAccessSeq('foo[bar.zoo]'))
        .to.deep.equal(['foo', 'coo'])
    })
    it('should handle nested access 2', async function () {
      expect(await scope.propertyAccessSeq('foo[bar["zoo"]]'))
        .to.deep.equal(['foo', 'coo'])
    })
    it('should handle nested access 3', async function () {
      expect(await scope.propertyAccessSeq('bar["foo"].zoo'))
        .to.deep.equal(['bar', 'foo', 'zoo'])
    })
    it('should handle nested access 4', async function () {
      expect(await scope.propertyAccessSeq('foo[0].bar'))
        .to.deep.equal(['foo', '0', 'bar'])
    })
    it('should handle nested access 5', async function () {
      expect(await scope.propertyAccessSeq('foo[one].bar'))
        .to.deep.equal(['foo', '1', 'bar'])
    })
    it('should handle nested access 6', async function () {
      expect(await scope.propertyAccessSeq('foo[two].bar'))
        .to.deep.equal(['foo', 'undefined', 'bar'])
    })
  })

  describe('#get()', function () {
    it('should get direct property', async function () {
      expect(await await scope.get('foo')).equal('zoo')
    })

    it('undefined property should yield undefined', async function () {
      expect(scope.get('notdefined')).to.be.rejected
      expect(await scope.get('notdefined')).to.equal(undefined)
      expect(await scope.get(false as any)).to.equal(undefined)
    })

    it('should throw for invalid path', async function () {
      expect(scope.get('')).to.be.rejectedWith('invalid path:""')
    })

    it('should throw when [] unbalanced', async function () {
      expect(scope.get('foo[bar')).to.be.rejectedWith(/unbalanced \[\]/)
    })

    it('should throw when "" unbalanced', async function () {
      expect(scope.get('foo["bar]')).to.be.rejectedWith(/unbalanced "/)
    })

    it("should throw when '' unbalanced", async function () {
      expect(scope.get("foo['bar]")).to.be.rejectedWith(/unbalanced '/)
    })
    it('should respect to toLiquid', async function () {
      const scope = new Scope({ foo: {
        toLiquid: () => ({ bar: 'BAR' }),
        bar: 'bar'
      } })
      expect(await scope.get('foo.bar')).to.equal('BAR')
    })

    it('should access child property via dot syntax', async function () {
      expect(await scope.get('bar.zoo')).to.equal('coo')
      expect(await scope.get('bar.arr')).to.deep.equal(['a', 'b'])
    })

    it('should access child property via [<String>] syntax', async function () {
      expect(await scope.get('bar["zoo"]')).to.equal('coo')
    })

    it('should access child property via [<Number>] syntax', async function () {
      expect(await scope.get('bar.arr[0]')).to.equal('a')
    })

    it('should access child property via [<Identifier>] syntax', async function () {
      expect(await scope.get('bar[foo]')).to.equal('coo')
    })

    it('should return undefined when not exist', async function () {
      expect(await scope.get('foo.foo.foo')).to.be.undefined
    })
    it('should return string length as size', async function () {
      expect(await scope.get('foo.size')).to.equal(3)
    })
    it('should return array length as size', async function () {
      expect(await scope.get('bar.arr.size')).to.equal(2)
    })
    it('should return size property if exists', async function () {
      expect(await scope.get('zoo.size')).to.equal(4)
    })
    it('should return undefined if do not have size and length', async function () {
      expect(await scope.get('one.size')).to.equal(undefined)
    })
  })

  describe('#set', function () {
    it('should set nested value', async function () {
      await scope.set('posts', {
        'first': {
          'name': 'A Nice Day'
        }
      })
      await scope.set('category', {
        'diary': ['first']
      })
      expect(await scope.get('posts[category.diary[0]].name'), 'A Nice Day')
    })

    it('should create parent if needed', async function () {
      await scope.set('a.b.c.d', 'COO')
      expect(await scope.get('a.b.c.d')).to.equal('COO')
    })
    it('should keep other properties of parent', async function () {
      scope.push({ obj: { foo: 'FOO' } })
      await scope.set('obj.bar', 'BAR')
      expect(await scope.get('obj.foo')).to.equal('FOO')
    })
    it('should abort if property cannot be set', async function () {
      scope.push({ obj: { foo: 'FOO' } })
      await scope.set('obj.foo.bar', 'BAR')
      expect(await scope.get('obj.foo')).to.equal('FOO')
    })
    it("should set parents' corresponding value", async function () {
      scope.push({})
      await scope.set('foo', 'bar')
      scope.pop()
      expect(await scope.get('foo')).to.equal('bar')
    })
  })
  describe('strictVariables', async function () {
    let scope: Scope
    beforeEach(function () {
      scope = new Scope(ctx, {
        strictVariables: true
      } as any)
    })
    it('should throw when variable not defined', function () {
      return expect(scope.get('notdefined')).to.be.rejectedWith(/undefined variable: notdefined/)
    })
    it('should throw when deep variable not exist', async function () {
      await scope.set('foo', 'FOO')
      return expect(scope.get('foo.bar.not.defined')).to.be.rejectedWith(/undefined variable: bar/)
    })
    it('should throw when itself not defined', async function () {
      await scope.set('foo', 'bar')
      return expect(scope.get('foo.BAR')).to.be.rejectedWith(/undefined variable: BAR/)
    })
    it('should find variable in parent scope', async function () {
      await scope.set('foo', 'foo')
      scope.push({
        'bar': 'bar'
      })
      expect(await scope.get('foo')).to.equal('foo')
    })
  })

  describe('.getAll()', function () {
    it('should get all properties when arguments empty', async function () {
      expect(await scope.getAll()).deep.equal(ctx)
    })
  })

  describe('.push()', function () {
    it('should push scope', async function () {
      await scope.set('bar', 'bar')
      scope.push({
        foo: 'foo'
      })
      expect(await scope.get('foo')).to.equal('foo')
      expect(await scope.get('bar')).to.equal('bar')
    })
    it('should hide deep properties by push', async function () {
      await scope.set('bar', { bar: 'bar' })
      scope.push({ bar: { foo: 'foo' } })
      expect(await scope.get('bar.foo')).to.equal('foo')
      expect(await scope.get('bar.bar')).to.equal(undefined)
    })
  })
  describe('.pop()', function () {
    it('should pop scope', async function () {
      scope.push({
        foo: 'foo'
      })
      scope.pop()
      expect(await scope.get('foo')).to.equal('zoo')
    })
  })
  it('should pop specified scope', async function () {
    const scope1 = {
      foo: 'foo'
    }
    const scope2 = {
      bar: 'bar'
    }
    scope.push(scope1)
    scope.push(scope2)
    expect(await scope.get('foo')).to.equal('foo')
    expect(await scope.get('bar')).to.equal('bar')
    scope.pop(scope1)
    expect(await scope.get('foo')).to.equal('zoo')
    expect(await scope.get('bar')).to.equal('bar')
  })
  it('should throw when specified scope not found', function () {
    const scope1 = {
      foo: 'foo'
    }
    expect(() => scope.pop(scope1)).to.throw('scope not found, cannot pop')
  })
})
