import * as chai from 'chai'
import { toThenable } from '../../../src/util/async'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import { Context } from '../../../src/context/context'
import { Filter } from '../../../src/template/filter/filter'
import { Value } from '../../../src/template/value'

chai.use(sinonChai)

const expect = chai.expect

describe('Value', function () {
  beforeEach(() => Filter.clear())

  describe('#constructor()', function () {
    it('should parse "foo', function () {
      const tpl = new Value('foo', false)
      expect(tpl.initial).to.equal('foo')
      expect(tpl.filters).to.deep.equal([])
    })

    it('should parse "foo | add"', function () {
      const tpl = new Value('foo | add', false)
      expect(tpl.initial).to.equal('foo')
      expect(tpl.filters.length).to.equal(1)
      expect(tpl.filters[0].args).to.eql([])
    })
    it('should parse "foo,foo | add"', function () {
      const tpl = new Value('foo,foo | add', false)
      expect(tpl.initial).to.equal('foo')
      expect(tpl.filters.length).to.equal(1)
      expect(tpl.filters[0].args).to.eql([])
    })
    it('should parse "foo | add: 3, false"', function () {
      const tpl = new Value('foo | add: 3, "foo"', false)
      expect(tpl.initial).to.equal('foo')
      expect(tpl.filters.length).to.equal(1)
      expect(tpl.filters[0].args).to.eql(['3', '"foo"'])
    })
    it('should parse "foo | add: "foo" bar, 3"', function () {
      const tpl = new Value('foo | add: "foo" bar, 3', false)
      expect(tpl.initial).to.equal('foo')
      expect(tpl.filters.length).to.equal(1)
      expect(tpl.filters[0].name).to.eql('add')
      expect(tpl.filters[0].args).to.eql(['"foo"', '3'])
    })
    it('should parse "foo | add: "|", 3', function () {
      const tpl = new Value('foo | add: "|", 3', false)
      expect(tpl.initial).to.equal('foo')
      expect(tpl.filters.length).to.equal(1)
      expect(tpl.filters[0].args).to.eql(['"|"', '3'])
    })
    it('should parse "foo | add: "|", 3', function () {
      const tpl = new Value('foo | add: "|", 3', false)
      expect(tpl.initial).to.equal('foo')
      expect(tpl.filters.length).to.equal(1)
      expect(tpl.filters[0].args).to.eql(['"|"', '3'])
    })
    it('should support arguments as named key/values', function () {
      const f = new Value('o | foo: key1: "literal1", key2: value2', false)
      expect(f.filters[0].name).to.equal('foo')
      expect(f.filters[0].args).to.eql([['key1', '"literal1"'], ['key2', 'value2']])
    })
    it('should support arguments as named key/values with inline literals', function () {
      const f = new Value('o | foo: "test0", key1: "literal1", key2: value2', false)
      expect(f.filters[0].name).to.equal('foo')
      expect(f.filters[0].args).to.deep.equal(['"test0"', ['key1', '"literal1"'], ['key2', 'value2']])
    })
    it('should support arguments as named key/values with inline values', function () {
      const f = new Value('o | foo: test0, key1: "literal1", key2: value2', false)
      expect(f.filters[0].name).to.equal('foo')
      expect(f.filters[0].args).to.deep.equal(['test0', ['key1', '"literal1"'], ['key2', 'value2']])
    })
    it('should support argument values named same as keys', function () {
      const f = new Value('o | foo: a: a', false)
      expect(f.filters[0].name).to.equal('foo')
      expect(f.filters[0].args).to.deep.equal([['a', 'a']])
    })
    it('should support argument literals named same as keys', function () {
      const f = new Value('o | foo: a: "a"', false)
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
    it('should tokenize array indexing', function () {
      expect(Value.tokenize('arr[0]')).to.eql(['arr[0]'])
    })
    it('should tokenize simple object access', function () {
      expect(Value.tokenize('obj["foo"]')).to.eql(['obj["foo"]'])
    })
    it('should tokenize simple dot syntax object access', function () {
      expect(Value.tokenize('obj.foo')).to.eql(['obj.foo'])
    })
    it('should tokenize complex object property access', function () {
      expect(Value.tokenize('obj["complex:string here"]')).to.eql(['obj["complex:string here"]'])
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
      await toThenable(tpl.value(scope))
      expect(date).to.have.been.calledWith('bar', 'b')
      expect(time).to.have.been.calledWith('y', 2)
    })
  })
})
