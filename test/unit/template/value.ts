import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import Context from '../../../src/context/context'
import { Filter } from '../../../src/template/filter/filter'
import Value from '../../../src/template/value'

chai.use(sinonChai)

const expect = chai.expect

describe('Value', function () {
  beforeEach(() => Filter.clear())

  describe('#constructor()', function () {
    it('should parse "foo', function () {
      const tpl = new Value('foo', false) as any
      expect(tpl.initial).to.equal('foo')
      expect(tpl.filters).to.deep.equal([])
    })

    it('should parse "foo | add"', function () {
      const tpl = new Value('foo | add', false) as any
      expect(tpl.initial).to.equal('foo')
      expect(tpl.filters.length).to.equal(1)
      expect(tpl.filters[0].args).to.eql([])
    })
    it('should parse "foo,foo | add"', function () {
      const tpl = new Value('foo,foo | add', false) as any
      expect(tpl.initial).to.equal('foo') as any
      expect(tpl.filters.length).to.equal(1)
      expect(tpl.filters[0].args).to.eql([])
    })
    it('should parse "foo | add: 3, false"', function () {
      const tpl = new Value('foo | add: 3, "foo"', false) as any
      expect(tpl.initial).to.equal('foo')
      expect(tpl.filters.length).to.equal(1)
      expect(tpl.filters[0].args).to.eql(['3', '"foo"'])
    })
    it('should parse "foo | add: "foo" bar, 3"', function () {
      const tpl = new Value('foo | add: "foo" bar, 3', false) as any
      expect(tpl.initial).to.equal('foo')
      expect(tpl.filters.length).to.equal(1)
      expect(tpl.filters[0].name).to.eql('add')
      expect(tpl.filters[0].args).to.eql(['"foo"', '3'])
    })
    it('should parse "foo | add: "|", 3', function () {
      const tpl = new Value('foo | add: "|", 3', false) as any
      expect(tpl.initial).to.equal('foo')
      expect(tpl.filters.length).to.equal(1)
      expect(tpl.filters[0].args).to.eql(['"|"', '3'])
    })
    it('should parse "foo | add: "|", 3', function () {
      const tpl = new Value('foo | add: "|", 3', false) as any
      expect(tpl.initial).to.equal('foo')
      expect(tpl.filters.length).to.equal(1)
      expect(tpl.filters[0].args).to.eql(['"|"', '3'])
    })
    it('should support arguments as named key/values', function () {
      const f = new Value('o | foo: key1: "literal1", key2: value2', false) as any
      expect(f.filters[0].name).to.equal('foo')
      expect(f.filters[0].args).to.eql([['key1', '"literal1"'], ['key2', 'value2']])
    })
    it('should support arguments as named key/values with inline literals', function () {
      const f = new Value('o | foo: "test0", key1: "literal1", key2: value2', false) as any
      expect(f.filters[0].name).to.equal('foo')
      expect(f.filters[0].args).to.deep.equal(['"test0"', ['key1', '"literal1"'], ['key2', 'value2']])
    })
    it('should support arguments as named key/values with inline values', function () {
      const f = new Value('o | foo: test0, key1: "literal1", key2: value2', false) as any
      expect(f.filters[0].name).to.equal('foo')
      expect(f.filters[0].args).to.deep.equal(['test0', ['key1', '"literal1"'], ['key2', 'value2']])
    })
    it('should support argument values named same as keys', function () {
      const f = new Value('o | foo: a: a', false) as any
      expect(f.filters[0].name).to.equal('foo')
      expect(f.filters[0].args).to.deep.equal([['a', 'a']])
    })
    it('should support argument literals named same as keys', function () {
      const f = new Value('o | foo: a: "a"', false) as any
      expect(f.filters[0].name).to.equal('foo')
      expect(f.filters[0].args).to.deep.equal([['a', '"a"']])
    })
  })

  describe('#tokenize()', function () {
    it('should tokenize a simple value', function () {
      expect(Value.tokenize('foo')).to.eql(['foo'])
    })
    it('should tokenize a value with spaces', function () {
      expect(Value.tokenize(' foo \t')).to.eql(['foo'])
    })
    it('should tokenize a simple filter', function () {
      expect(Value.tokenize('foo | add')).to.eql(['foo', '|', 'add'])
    })
    it('should tokenize a filter with a single argument', function () {
      expect(Value.tokenize('foo | add: 1')).to.eql(['foo', '|', 'add', ':', '1'])
    })
  })

  describe('#value()', function () {
    it('should call chained filters correctly', async function () {
      const date = sinon.stub().returns('y')
      const time = sinon.spy()
      Filter.register('date', date)
      Filter.register('time', time)
      const tpl = new Value('foo.bar | date: "b" | time:2', false)
      const scope = new Context({
        foo: { bar: 'bar' }
      })
      await tpl.value(scope)
      expect(date).to.have.been.calledWith('bar', 'b')
      expect(time).to.have.been.calledWith('y', 2)
    })
  })
})
