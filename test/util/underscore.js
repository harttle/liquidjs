const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
const Errors = require('../../src/util/error.js')
chai.use(require('sinon-chai'))

var _ = require('../../src/util/underscore.js')

describe('util/underscore', function () {
  describe('.isError()', function () {
    it('should return true for new Error', function () {
      expect(_.isError(new Error())).to.be.true
    })
    it('should return true for RenderError', function () {
      var tpl = {
        token: {
          input: 'xx'
        }
      }
      expect(_.isError(new Errors.RenderError(new Error(), tpl))).to.be.true
    })
    it('should return true for RenderBreakError', function () {
      expect(_.isError(new Errors.RenderBreakError())).to.be.true
    })
  })
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
  describe('.forOwn()', function () {
    it('should iterate all properties', function () {
      var spy = sinon.spy()
      var obj = {
        foo: 'bar'
      }
      _.forOwn(obj, spy)
      expect(spy).to.have.been.calledWith('bar', 'foo', obj)
    })
    it('should not iterate over properties on prototype', function () {
      var spy = sinon.spy()
      var obj = Object.create({
        bar: 'foo'
      })
      obj.foo = 'bar'
      _.forOwn(obj, spy)
      expect(spy).to.have.been.calledOnce
      expect(spy).to.have.been.calledWith('bar', 'foo', obj)
    })
    it('should break when returned false', function () {
      var spy = sinon.stub().returns(false)
      _.forOwn({
        'foo': 'foo',
        'bar': 'foo'
      }, spy)
      expect(spy).to.have.been.calledOnce
    })
  })
  describe('.echo()', function () {
    it('should be transparent', function () {
      expect(_.echo('foo')('bar')).to.equal('bar')
    })
    it('should log the arguments', function () {
      var log = sinon.spy(console, 'log')
      _.echo('foo')('bar')
      expect(log).to.have.been.calledWith('[foo]', 'bar')
    })
  })
  describe('.range()', function () {
    it('should return a range of integers', function () {
      expect(_.range(3, 5)).to.deep.equal([3, 4])
    })
    it('should treat start as 0 if omitted', function () {
      expect(_.range(3)).to.deep.equal([0, 1, 2])
    })
  })
  describe('.assign()', function () {
    it('should handle null dst', function () {
      expect(_.assign(null, {
        foo: 'bar'
      })).to.deep.equal({
        foo: 'bar'
      })
    })
    it('should assign 2 objects', function () {
      var src = {
        foo: 'foo',
        bar: 'bar'
      }
      var dst = {
        foo: 'bar',
        kaa: 'kaa'
      }
      expect(_.assign(dst, src)).to.deep.equal({
        foo: 'foo',
        bar: 'bar',
        kaa: 'kaa'
      })
    })
    it('should assign 3 objects', function () {
      expect(_.assign({
        foo: 'foo'
      }, {
        bar: 'bar'
      }, {
        car: 'car'
      })).to.deep.equal({
        foo: 'foo',
        bar: 'bar',
        car: 'car'
      })
    })
  })
  describe('.uniq()', function () {
    it('should handle empty array', function () {
      expect(_.uniq([])).to.deep.equal([])
    })
    it('should do uniq', function () {
      expect(_.uniq([1, 'a', 'a', 1])).to.deep.equal([1, 'a'])
    })
  })
})
