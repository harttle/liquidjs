import * as _ from './underscore'

describe('util/underscore', function () {
  describe('.isString()', function () {
    it('should return true for literal string', function () {
      expect(_.isString('foo')).toBeTruthy()
    })
    it('should return true String instance', function () {
      expect(_.isString(String('foo'))).toBeTruthy()
    })
    it('should return false for 123 ', function () {
      expect(_.isString(123)).toBeFalsy()
    })
  })
  describe('.isNumber()', function () {
    it('should return false for "foo"', function () {
      expect(_.isNumber('foo')).toBeFalsy()
    })
    it('should return true for 0', function () {
      expect(_.isNumber(0)).toBeTruthy()
    })
  })
  describe('.stringify()', function () {
    it('should return "" for null', function () {
      expect(_.stringify(null)).toBe('')
    })
    it('should return "" for undefined', function () {
      expect(_.stringify(undefined)).toBe('')
    })
    it('should return regex string for RegExp', function () {
      const reg = /foo/g
      expect(_.stringify(reg)).toBe('/foo/g')
    })
    it('should return locale string for date', function () {
      const date = new Date('2018-10-01T14:51:00.000Z')
      // Mon Oct 01 2018 22:51:00 GMT+0800 (CST)
      expect(_.stringify(date)).toBe(date.toString())
    })
  })
  describe('.forOwn()', function () {
    it('should iterate all properties', function () {
      const spy = jest.fn()
      const obj = {
        foo: 'bar'
      }
      _.forOwn(obj, spy)
      expect(spy).toHaveBeenCalledWith('bar', 'foo', obj)
    })
    it('should default to empty object', function () {
      const spy = jest.fn()
      _.forOwn(undefined, spy)
      expect(spy).not.toHaveBeenCalled()
    })
    it('should not iterate over properties on prototype', function () {
      const spy = jest.fn()
      const obj = Object.create({
        bar: 'foo'
      })
      obj.foo = 'bar'
      _.forOwn(obj, spy)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('bar', 'foo', obj)
    })
    it('should break when returned false', function () {
      const spy = jest.fn(() => false)
      _.forOwn({
        'foo': 'foo',
        'bar': 'foo'
      }, spy)
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
  describe('.range()', function () {
    it('should return a range of integers', function () {
      expect(_.range(3, 5)).toEqual([3, 4])
    })
  })
  describe('.isObject()', function () {
    it('should return true for function', function () {
      expect(_.isObject((x: any) => x)).toBeTruthy()
    })
    it('should return true for plain object', function () {
      expect(_.isObject({})).toBeTruthy()
    })
    it('should return false for null', function () {
      expect(_.isObject(null)).toBeFalsy()
    })
    it('should return false for number', function () {
      expect(_.isObject(2)).toBeFalsy()
    })
  })
  describe('.padEnd()', function () {
    it('should default ch to " "', () => {
      expect(_.padEnd('foo', 5)).toBe('foo  ')
    })
  })
  describe('.changeCase()', function () {
    it('should to upper case if there is one lowercase', () => {
      expect(_.changeCase('fooA')).toBe('FOOA')
    })
    it('should to lower case if all upper case', () => {
      expect(_.changeCase('FOOA')).toBe('fooa')
    })
  })
  describe('.caseInsensitiveCompare()', function () {
    it('should "foo" > "bar"', () => {
      expect(_.caseInsensitiveCompare('foo', 'bar')).toBe(1)
    })
    it('should "foo" < null', () => {
      expect(_.caseInsensitiveCompare('foo', null)).toBe(-1)
    })
    it('should null > "foo"', () => {
      expect(_.caseInsensitiveCompare(null, 'foo')).toBe(1)
    })
    it('should -1 < 0', () => {
      expect(_.caseInsensitiveCompare(-1, 0)).toBe(-1)
    })
    it('should 1 > 0', () => {
      expect(_.caseInsensitiveCompare(1, 0)).toBe(1)
    })
  })
})
