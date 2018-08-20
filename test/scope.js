import chai from 'chai'
import {factory as scopeFactory} from '../src/scope.js'

const expect = chai.expect

describe('scope', function () {
  let scope, ctx
  beforeEach(function () {
    ctx = {
      foo: 'zoo',
      bar: {
        zoo: 'coo',
        'Mr.Smith': 'John',
        arr: ['a', 'b']
      }
    }
    scope = scopeFactory(ctx)
  })

  describe('#propertyAccessSeq()', function () {
    it('should handle dot syntax', function () {
      expect(scope.propertyAccessSeq('foo.bar'))
        .to.deep.equal(['foo', 'bar'])
    })
    it('should handle [<String>] syntax', function () {
      expect(scope.propertyAccessSeq('foo["bar"]'))
        .to.deep.equal(['foo', 'bar'])
    })
    it('should handle [<Identifier>] syntax', function () {
      expect(scope.propertyAccessSeq('foo[foo]'))
        .to.deep.equal(['foo', 'zoo'])
    })
    it('should handle nested access 1', function () {
      expect(scope.propertyAccessSeq('foo[bar.zoo]'))
        .to.deep.equal(['foo', 'coo'])
    })
    it('should handle nested access 2', function () {
      expect(scope.propertyAccessSeq('foo[bar["zoo"]]'))
        .to.deep.equal(['foo', 'coo'])
    })
    it('should handle nested access 3', function () {
      expect(scope.propertyAccessSeq('bar["foo"].zoo'))
        .to.deep.equal(['bar', 'foo', 'zoo'])
    })
    it('should handle nested access 4', function () {
      expect(scope.propertyAccessSeq('foo[0].bar'))
        .to.deep.equal(['foo', '0', 'bar'])
    })
  })

  describe('#get()', function () {
    it('should get direct property', function () {
      expect(scope.get('foo')).equal('zoo')
    })

    it('should get undefined property', function () {
      function fn () {
        scope.get('notdefined')
      }
      expect(fn).to.not.throw()
      expect(scope.get('notdefined')).to.equal(undefined)
      expect(scope.get(false)).to.equal(undefined)
    })

    it('should throw for invalid path', function () {
      function fn () {
        scope.get('')
      }
      expect(fn).to.throw('invalid path:""')
    })

    it('should throw when [] unbalanced', function () {
      expect(function () {
        scope.get('foo[bar')
      }).to.throw(/unbalanced \[\]/)
    })

    it('should throw when "" unbalanced', function () {
      expect(function () {
        scope.get('foo["bar]')
      }).to.throw(/unbalanced "/)
    })

    it("should throw when '' unbalanced", function () {
      expect(function () {
        scope.get("foo['bar]")
      }).to.throw(/unbalanced '/)
    })

    it('should respect to to_liquid', function () {
      const scope = scopeFactory({foo: {
        to_liquid: () => ({bar: 'BAR'}),
        bar: 'bar'
      }})
      expect(scope.get('foo.bar')).to.equal('BAR')
    })

    it('should respect to toLiquid', function () {
      const scope = scopeFactory({foo: {
        toLiquid: () => ({bar: 'BAR'}),
        bar: 'bar'
      }})
      expect(scope.get('foo.bar')).to.equal('BAR')
    })

    it('should access child property via dot syntax', function () {
      expect(scope.get('bar.zoo')).to.equal('coo')
      expect(scope.get('bar.arr')).to.deep.equal(['a', 'b'])
    })

    it('should access child property via [<String>] syntax', function () {
      expect(scope.get('bar["zoo"]')).to.equal('coo')
    })

    it('should access child property via [<Number>] syntax', function () {
      expect(scope.get('bar.arr[0]')).to.equal('a')
    })

    it('should access child property via [<Identifier>] syntax', function () {
      expect(scope.get('bar[foo]')).to.equal('coo')
    })

    it('should return undefined when not exist', function () {
      expect(scope.get('foo.foo.foo')).to.be.undefined
    })
  })

  describe('#set', function () {
    it('should set nested value', function () {
      scope.set('posts', {
        'first': {
          'name': 'A Nice Day'
        }
      })
      scope.set('category', {
        'diary': ['first']
      })
      expect(scope.get('posts[category.diary[0]].name'), 'A Nice Day')
    })

    it('should create parent if needed', function () {
      scope.set('a.b.c.d', 'COO')
      expect(scope.get('a.b.c.d')).to.equal('COO')
    })
    it('should keep other properties of parent', function () {
      scope.push({obj: {foo: 'FOO'}})
      scope.set('obj.bar', 'BAR')
      expect(scope.get('obj.foo')).to.equal('FOO')
    })
    it('should abort if property cannot be set', function () {
      scope.push({obj: {foo: 'FOO'}})
      scope.set('obj.foo.bar', 'BAR')
      expect(scope.get('obj.foo')).to.equal('FOO')
    })
    it("should set parents' corresponding value", function () {
      scope.push({})
      scope.set('foo', 'bar')
      scope.pop()
      expect(scope.get('foo')).to.equal('bar')
    })
  })
  describe('strict_variables', function () {
    let scope
    beforeEach(function () {
      scope = scopeFactory(ctx, {
        strict_variables: true
      })
    })
    it('should throw when variable not defined', function () {
      function fn () {
        scope.get('notdefined')
      }
      expect(fn).to.throw(/undefined variable: notdefined/)
    })
    it('should throw when deep variable not exist', function () {
      scope.set('foo', 'FOO')
      function fn () {
        scope.get('foo.bar.not.defined')
      }
      expect(fn).to.throw(/undefined variable: bar/)
    })
    it('should throw when itself not defined', function () {
      scope.set('foo', 'bar')
      function fn () {
        scope.get('foo.BAR')
      }
      expect(fn).to.throw(/undefined variable: BAR/)
    })
    it('should find variable in parent scope', function () {
      scope.set('foo', 'foo')
      scope.push({
        'bar': 'bar'
      })
      expect(scope.get('foo')).to.equal('foo')
    })
  })

  describe('.getAll()', function () {
    it('should get all properties when arguments empty', function () {
      expect(scope.getAll()).deep.equal(ctx)
    })
  })

  describe('.push()', function () {
    it('should push scope', function () {
      scope.set('bar', 'bar')
      scope.push({
        foo: 'foo'
      })
      expect(scope.get('foo')).to.equal('foo')
      expect(scope.get('bar')).to.equal('bar')
    })
    it('should hide deep properties by push', function () {
      scope.set('bar', {bar: 'bar'})
      scope.push({bar: {foo: 'foo'}})
      expect(scope.get('bar.foo')).to.equal('foo')
      expect(scope.get('bar.bar')).to.equal(undefined)
    })
  })
  describe('.pop()', function () {
    it('should pop scope', function () {
      scope.push({
        foo: 'foo'
      })
      scope.pop()
      expect(scope.get('foo')).to.equal('zoo')
    })
  })
  it('should pop specified scope', function () {
    const scope1 = {
      foo: 'foo'
    }
    const scope2 = {
      bar: 'bar'
    }
    scope.push(scope1)
    scope.push(scope2)
    expect(scope.get('foo')).to.equal('foo')
    expect(scope.get('bar')).to.equal('bar')
    scope.pop(scope1)
    expect(scope.get('foo')).to.equal('zoo')
    expect(scope.get('bar')).to.equal('bar')
  })
  it('should throw when specified scope not found', function () {
    const scope1 = {
      foo: 'foo'
    }
    expect(() => scope.pop(scope1)).to.throw('scope not found, cannot pop')
  })
})
