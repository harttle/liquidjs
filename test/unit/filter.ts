import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import Filter from 'src/template/filter'
import Scope from 'src/scope/scope'

chai.use(sinonChai)
const expect = chai.expect

describe('filter', function () {
  let scope
  beforeEach(function () {
    Filter.clear()
    scope = new Scope()
  })
  it('should return default filter when not registered', function () {
    const result = new Filter('foo')
    expect(result.name).to.equal('foo')
  })

  it('should throw when filter name illegal', function () {
    expect(function () {
      new Filter('/')
    }).to.throw(/illegal filter/)
  })

  it('should parse argument syntax', function () {
    Filter.register('foo', x => x)
    const f = new Filter('foo: a, "b"')

    expect(f.name).to.equal('foo')
    expect(f.args).to.deep.equal(['a', '"b"'])
  })

  it('should register a simple filter', function () {
    Filter.register('upcase', x => x.toUpperCase())
    expect(new Filter('upcase').render('foo', scope)).to.equal('FOO')
  })

  it('should register a argumented filter', function () {
    Filter.register('add', (a, b) => a + b)
    expect(new Filter('add: 2').render(3, scope)).to.equal(5)
  })

  it('should register a multi-argumented filter', function () {
    Filter.register('add', (a, b, c) => a + b + c)
    expect(new Filter('add: 2, "c"').render(3, scope)).to.equal('5c')
  })

  it('should call filter with corrct arguments', function () {
    const spy = sinon.spy()
    Filter.register('foo', spy)
    new Filter('foo: 33').render('foo', scope)
    expect(spy).to.have.been.calledWith('foo', 33)
  })

  it('should support arguments as named key/values', function () {
    Filter.register('foo', x => x)
    const f = new Filter('foo: key1: "literal1", key2: value2')
    expect(f.name).to.equal('foo')
    expect(f.args).to.deep.equal([ '\'key1\'', '"literal1"', '\'key2\'', 'value2' ])
  })

  it('should support arguments as named key/values with inline literals', function () {
    Filter.register('foo', x => x)
    const f = new Filter('foo: "test0", key1: "literal1", key2: value2')
    expect(f.name).to.equal('foo')
    expect(f.args).to.deep.equal([ '"test0"', '\'key1\'', '"literal1"', '\'key2\'', 'value2' ])
  })

  it('should support arguments as named key/values with inline values', function () {
    Filter.register('foo', x => x)
    const f = new Filter('foo: test0, key1: "literal1", key2: value2')
    expect(f.name).to.equal('foo')
    expect(f.args).to.deep.equal([ 'test0', '\'key1\'', '"literal1"', '\'key2\'', 'value2' ])
  })

  it('should support argument values named same as keys', function () {
    Filter.register('foo', x => x)
    const f = new Filter('foo: a: a')
    expect(f.name).to.equal('foo')
    expect(f.args).to.deep.equal(['\'a\'', 'a'])
  })

  it('should support argument literals named same as keys', function () {
    Filter.register('foo', x => x)
    const f = new Filter('foo: a: "a"')
    expect(f.name).to.equal('foo')
    expect(f.args).to.deep.equal(['\'a\'', '"a"'])
  })

  it('should not throw undefined filter by default', function () {
    expect(new Filter('undefined').render('foo', scope)).to.equal('foo')
  })
})
