const chai = require('chai')
const expect = chai.expect

const lexical = require('../../src/lexical.js')

describe('lexical', function () {
  it('should test filter syntax', function () {
    expect(lexical.filterLine.test('abs')).to.equal(true)
    expect(lexical.filterLine.test('plus:1')).to.equal(true)
    expect(lexical.filterLine.test('replace: "a", b')).to.equal(true)
    expect(lexical.filterLine.test('foo: a, "b"')).to.equal(true)
    expect(lexical.filterLine.test('abs | another')).to.equal(false)
    expect(lexical.filterLine.test('join: "," | another')).to.equal(false)
    expect(lexical.filterLine.test('obj_test: k1: "v1", k2: "v2"')).to.equal(true)
  })

  it('should test boolean literal', function () {
    expect(lexical.isLiteral('true')).to.equal(true)
    expect(lexical.isLiteral('TrUE')).to.equal(true)
    expect(lexical.isLiteral('false')).to.equal(true)
  })

  it('should test number literal', function () {
    expect(lexical.isLiteral('2.3')).to.equal(true)
    expect(lexical.isLiteral('.3')).to.equal(true)
    expect(lexical.isLiteral('-3.')).to.equal(true)
    expect(lexical.isLiteral('23')).to.equal(true)
  })

  it('should test range literal', function () {
    expect(lexical.isRange('(12..32)')).to.equal(true)
    expect(lexical.isRange('(12..foo)')).to.equal(true)
    expect(lexical.isRange('(foo.bar..foo)')).to.equal(true)
  })

  it('should test string literal', function () {
    expect(lexical.isLiteral('""')).to.equal(true)
    expect(lexical.isLiteral('"a\'b"')).to.equal(true)
    expect(lexical.isLiteral("''")).to.equal(true)
    expect(lexical.isLiteral("'a bcd'")).to.equal(true)
  })

  describe('.isVariable()', function () {
    it('should return true for foo', function () {
      expect(lexical.isVariable('foo')).to.equal(true)
    })
    it('should return true for.bar.foo', function () {
      expect(lexical.isVariable('foo.bar.foo')).to.equal(true)
    })
    it('should return true for foo[0].b', function () {
      expect(lexical.isVariable('foo[0].b')).to.equal(true)
    })
    it('should return true for 0a', function () {
      expect(lexical.isVariable('0a')).to.equal(true)
    })
    it('should return true for foo[a.b]', function () {
      expect(lexical.isVariable('foo[a.b]')).to.equal(true)
    })
    it('should return true for foo[a.b]', function () {
      expect(lexical.isVariable("foo['a[0]']")).to.equal(true)
    })
    it('should return true for "var-1"', function () {
      expect(lexical.isVariable('var-1')).to.equal(true)
    })
    it('should return true for "-var"', function () {
      expect(lexical.isVariable('-var')).to.equal(true)
    })
    it('should return true for "var-"', function () {
      expect(lexical.isVariable('var-')).to.equal(true)
    })
    it('should return true for "3-4"', function () {
      expect(lexical.isVariable('3-4')).to.equal(true)
    })
  })

  it('should test none literal', function () {
    expect(lexical.isLiteral('2a')).to.equal(false)
    expect(lexical.isLiteral('"x')).to.equal(false)
    expect(lexical.isLiteral('a2')).to.equal(false)
  })

  it('should test none variable', function () {
    expect(lexical.isVariable('a.')).to.equal(false)
    expect(lexical.isVariable('.b')).to.equal(false)
    expect(lexical.isVariable('.')).to.equal(false)
    expect(lexical.isVariable('[0][12].bar[0]')).to.equal(false)
  })

  describe('.parseLiteral()', function () {
    it('should parse boolean literal', function () {
      expect(lexical.parseLiteral('true')).to.equal(true)
      expect(lexical.parseLiteral('TrUE')).to.equal(true)
      expect(lexical.parseLiteral('false')).to.equal(false)
    })

    it('should parse number literal', function () {
      expect(lexical.parseLiteral('2.3')).to.equal(2.3)
      expect(lexical.parseLiteral('.32')).to.equal(0.32)
      expect(lexical.parseLiteral('-23.')).to.equal(-23)
      expect(lexical.parseLiteral('23')).to.equal(23)
    })

    it('should parse string literal', function () {
      expect(lexical.parseLiteral('"ab\'c"')).to.equal("ab'c")
    })

    it('should throw if non-literal', function () {
      const fn = () => lexical.parseLiteral('a')
      expect(fn).to.throw("cannot parse 'a' as literal")
    })
  })

  describe('.matchValue()', function () {
    it('should match -5-5', function () {
      const match = lexical.matchValue('-5-5')
      expect(match && match[0]).to.equal('-5-5')
    })
    it('should match 4-3', function () {
      const match = lexical.matchValue('4-3')
      expect(match && match[0]).to.equal('4-3')
    })
    it('should match 4-3', function () {
      const match = lexical.matchValue('4-3')
      expect(match && match[0]).to.equal('4-3')
    })
    it('should match var-1', function () {
      const match = lexical.matchValue('var-1')
      expect(match && match[0]).to.equal('var-1')
    })
  })
})
