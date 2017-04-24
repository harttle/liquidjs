const chai = require('chai')
const expect = chai.expect

var Scope = require('../src/scope.js')

describe('scope', function () {
  var scope, ctx
  beforeEach(function () {
    ctx = {
      foo: 'zoo',
      bar: {
        zoo: 'coo',
        'Mr.Smith': 'John',
        arr: ['a', 'b']
      }
    }
    scope = Scope.factory(ctx)
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
      expect(scope.get('')).to.equal(undefined)
      expect(scope.get(false)).to.equal(undefined)
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

    it('should support nested case', function () {
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
  })

  describe('strict_variables', function () {
    var scope
    beforeEach(function () {
      scope = Scope.factory(ctx, {
        strict_variables: true
      })
    })
    it('should throw undefined in strict mode', function () {
      function fn () {
        scope.get('notdefined')
      }
      expect(fn).to.throw(/undefined variable: notdefined/)
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
    it('should throw when trying to push non-object', function () {
      expect(function () {
        scope.push(false)
      }).to.throw()
    })
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

  describe('.unshift()', function () {
    it('should throw when trying to unshift non-object', function () {
      expect(function () {
        scope.unshift(false)
      }).to.throw()
    })
    it('should unshift scope', function () {
      scope.unshift({
        foo: 'blue',
        foo1: 'foo1'
      })
      expect(scope.get('foo')).to.equal('zoo')
      expect(scope.get('foo1')).to.equal('foo1')
    })
  })
  describe('.shift()', function () {
    it('should shift scope', function () {
      scope.unshift({
        foo: 'blue',
        foo1: 'foo1'
      })
      scope.shift()
      expect(scope.get('foo')).to.equal('zoo')
      expect(scope.get('foo1')).to.equal(undefined)
    })
  })
})
