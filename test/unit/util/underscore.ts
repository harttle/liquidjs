import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import * as _ from '../../../src/util/underscore'

const expect = chai.expect
chai.use(sinonChai)

describe('util/underscore', function () {
  describe('.isString()', function () {
    it('should return true for literal string', function () {
      expect(_.isString('foo')).to.be.true
    })
    it('should return true String instance', function () {
      expect(_.isString(String('foo'))).to.be.true
    })
    it('should return false for 123 ', function () {
      expect(_.isString(123)).to.be.false
    })
  })
  describe('.isNumber()', function () {
    it('should return false for "foo"', function () {
      expect(_.isNumber('foo')).to.be.false
    })
    it('should return true for 0', function () {
      expect(_.isNumber(0)).to.be.true
    })
  })
  describe('.stringify()', function () {
    it('should return "" for null', function () {
      expect(_.stringify(null)).to.equal('')
    })
    it('should return "" for undefined', function () {
      expect(_.stringify(undefined)).to.equal('')
    })
    it('should return regex string for RegExp', function () {
      const reg = /foo/g
      expect(_.stringify(reg)).to.equal('/foo/g')
    })
    it('should return locale string for date', function () {
      const date = new Date('2018-10-01T14:51:00.000Z')
      // Mon Oct 01 2018 22:51:00 GMT+0800 (CST)
      expect(_.stringify(date)).to.equal(date.toString())
    })
  })
  describe('.forOwn()', function () {
    it('should iterate all properties', function () {
      const spy = sinon.spy()
      const obj = {
        foo: 'bar'
      }
      _.forOwn(obj, spy)
      expect(spy).to.have.been.calledWith('bar', 'foo', obj)
    })
    it('should default to empty object', function () {
      const spy = sinon.spy()
      _.forOwn(undefined, spy)
      expect(spy).to.have.not.been.called
    })
    it('should not iterate over properties on prototype', function () {
      const spy = sinon.spy()
      const obj = Object.create({
        bar: 'foo'
      })
      obj.foo = 'bar'
      _.forOwn(obj, spy)
      expect(spy).to.have.been.calledOnce
      expect(spy).to.have.been.calledWith('bar', 'foo', obj)
    })
    it('should break when returned false', function () {
      const spy = sinon.stub().returns(false)
      _.forOwn({
        'foo': 'foo',
        'bar': 'foo'
      }, spy)
      expect(spy).to.have.been.calledOnce
    })
  })
  describe('.range()', function () {
    it('should return a range of integers', function () {
      expect(_.range(3, 5)).to.deep.equal([3, 4])
    })
  })
  describe('.isObject()', function () {
    it('should return true for function', function () {
      expect(_.isObject((x: any) => x)).to.be.true
    })
    it('should return true for plain object', function () {
      expect(_.isObject({})).to.be.true
    })
    it('should return false for null', function () {
      expect(_.isObject(null)).to.be.false
    })
    it('should return false for number', function () {
      expect(_.isObject(2)).to.be.false
    })
  })
  describe('.padEnd()', function () {
    it('should default ch to " "', () => {
      expect(_.padEnd('foo', 5)).to.equal('foo  ')
    })
  })
  describe('.changeCase()', function () {
    it('should to upper case if there is one lowercase', () => {
      expect(_.changeCase('fooA')).to.equal('FOOA')
    })
    it('should to lower case if all upper case', () => {
      expect(_.changeCase('FOOA')).to.equal('fooa')
    })
  })
  describe('.caseInsensitiveCompare()', function () {
    it('should "foo" > "bar"', () => {
      expect(_.caseInsensitiveCompare('foo', 'bar')).to.equal(1)
    })
    it('should "foo" < null', () => {
      expect(_.caseInsensitiveCompare('foo', null)).to.equal(-1)
    })
    it('should null > "foo"', () => {
      expect(_.caseInsensitiveCompare(null, 'foo')).to.equal(1)
    })
    it('should -1 < 0', () => {
      expect(_.caseInsensitiveCompare(-1, 0)).to.equal(-1)
    })
    it('should 1 > 0', () => {
      expect(_.caseInsensitiveCompare(1, 0)).to.equal(1)
    })
  })
})
