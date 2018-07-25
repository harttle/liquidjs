const chai = require('chai')
const expect = chai.expect
var syntax = require('../src/syntax.js')
var Scope = require('../src/scope.js')

var evalExp = syntax.evalExp
var evalValue = syntax.evalValue
var isTruthy = syntax.isTruthy
var validateExp = syntax.validateExpression

describe('expression', function () {
  var scope

  beforeEach(function () {
    scope = Scope.factory({
      one: 1,
      two: 2,
      empty: '',
      x: 'XXX',
      y: undefined,
      z: null
    })
  })

  describe('.evalValue()', function () {
    it('should eval literals', function () {
      expect(evalValue('2.3')).to.equal(2.3)
      expect(evalValue('"foo"')).to.equal('foo')
    })

    it('should eval variables', function () {
      expect(evalValue('23', scope)).to.equal(23)
      expect(evalValue('one', scope)).to.equal(1)
      expect(evalValue('x', scope)).to.equal('XXX')
    })

    it('should throw if not valid', function () {
      var fn = () => evalValue('===')
      expect(fn).to.throw("cannot eval '===' as value")
    })
  })

  describe('.isTruthy()', function () {
    // Spec: https://shopify.github.io/liquid/basics/truthy-and-falsy/
    expect(isTruthy(true)).to.be.true
    expect(isTruthy(false)).to.be.false
    expect(isTruthy(null)).to.be.false
    expect(isTruthy('foo')).to.be.true
    expect(isTruthy('')).to.be.true
    expect(isTruthy(0)).to.be.true
    expect(isTruthy(1)).to.be.true
    expect(isTruthy(1.1)).to.be.true
    expect(isTruthy([1])).to.be.true
    expect(isTruthy([])).to.be.true
  })

  describe('.evalExp()', function () {
    it('should throw when scope undefined', function () {
      expect(function () {
        evalExp('')
      }).to.throw(/scope undefined/)
    })

    it('should eval simple expression', function () {
      expect(evalExp('1<2', scope)).to.equal(true)
      expect(evalExp('2<=2', scope)).to.equal(true)
      expect(evalExp('one<=two', scope)).to.equal(true)
      expect(evalExp('x contains "x"', scope)).to.equal(false)
      expect(evalExp('x contains "X"', scope)).to.equal(true)
      expect(evalExp('1 contains "x"', scope)).to.equal(false)
      expect(evalExp('y contains "x"', scope)).to.equal(false)
      expect(evalExp('z contains "x"', scope)).to.equal(false)
      expect(evalExp('(1..5) contains 3', scope)).to.equal(true)
      expect(evalExp('(1..5) contains 6', scope)).to.equal(false)
      expect(evalExp('"<=" == "<="', scope)).to.equal(true)
    })

    it('should validate simple expression', function () {
      expect(validateExp('1<2', scope)).to.deep.equal([]);
      expect(validateExp('1<!2', scope)).to.deep.equal(["cannot eval '!2' as value"]);
      expect(validateExp('y<2', scope)).to.deep.equal(["y variable not present"]);
      expect(validateExp('y<!2', scope)).to.deep.equal(["y variable not present", "cannot eval '!2' as value"]);
      expect(validateExp('x<2', scope)).to.deep.equal([]);
      expect(validateExp('x!=<2', scope)).to.deep.equal(["Invalid Operator Usage"]);
    })

    it('should validate complex expression', function () {
      expect(validateExp('1<2 and 2<3', scope)).to.deep.equal([]);
      expect(validateExp('1<!2 and 2<3', scope)).to.deep.equal(["cannot eval '!2' as value"]);
      expect(validateExp('y<2 and z<3', scope)).to.deep.equal(["y variable not present", "z variable not present"]);
      expect(validateExp('y<!2 and z<3', scope)).to.deep.equal(["y variable not present", "cannot eval '!2' as value", "z variable not present"]);
      expect(validateExp('x<2 and x<3', scope)).to.deep.equal([]);
      expect(validateExp('x!=<2 and x<===3', scope)).to.deep.equal(["Invalid Operator Usage", "Invalid Operator Usage"]);
    })

    describe('complex expression', function () {
      it('should support value or value', function () {
        expect(evalExp('false or true', scope)).to.equal(true)
      })
      it('should support < and contains', function () {
        expect(evalExp('1<2 and x contains "x"', scope)).to.equal(false)
      })
      it('should support < or contains', function () {
        expect(evalExp('1<2 or x contains "x"', scope)).to.equal(true)
      })
      it('should support value and !=', function () {
        expect(evalExp('empty and empty != ""', scope)).to.equal(false)
      })
    })

    it('should eval range expression', function () {
      expect(evalExp('(2..4)', scope)).to.deep.equal([2, 3, 4])
      expect(evalExp('(two..4)', scope)).to.deep.equal([2, 3, 4])
    })
  })
})
