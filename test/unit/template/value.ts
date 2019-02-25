import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import Scope from '../../../src/scope/scope'
import Filter from '../../../src/template/filter/filter'
import Value from '../../../src/template/value'

chai.use(sinonChai)

const expect = chai.expect

describe('Value', function () {
  beforeEach(() => Filter.clear())

  it('should parse "foo', function () {
    const tpl: any = new Value('foo', false)
    expect(tpl.initial).to.equal('foo')
    expect(tpl.filters).to.deep.equal([])
  })

  it('should parse "foo | add"', function () {
    const tpl: any = new Value('foo | add', false)
    expect(tpl.initial).to.equal('foo')
    expect(tpl.filters.length).to.equal(1)
    expect(tpl.filters[0].args).to.eql([])
  })
  it('should parse "foo | add: "foo" bar, 3"', function () {
    const tpl: any = new Value('foo | add: "foo" bar, 3', false)
    expect(tpl.initial).to.equal('foo')
    expect(tpl.filters.length).to.equal(1)
    expect(tpl.filters[0].name).to.eql('add')
    expect(tpl.filters[0].args).to.eql(['"foo"', '3'])
  })
  it('should parse "foo | add: 3, false"', function () {
    const tpl: any = new Value('foo | add: 3, "foo"', false)
    expect(tpl.initial).to.equal('foo')
    expect(tpl.filters.length).to.equal(1)
    expect(tpl.filters[0].args).to.eql(['3', '"foo"'])
  })
  it('should parse "foo | add: "|", 3', function () {
    const tpl: any = new Value('foo | add: "|", 3', false)
    expect(tpl.initial).to.equal('foo')
    expect(tpl.filters.length).to.equal(1)
    expect(tpl.filters[0].args).to.eql(['"|"', '3'])
  })

  it('should parse "foo | add: "|", 3', function () {
    const tpl: any = new Value('foo | add: "|", 3', false)
    expect(tpl.initial).to.equal('foo')
    expect(tpl.filters.length).to.equal(1)
    expect(tpl.filters[0].args).to.eql(['"|"', '3'])
  })

  it('should call chained filters correctly', function () {
    const date = sinon.stub().returns('y')
    const time = sinon.spy()
    Filter.register('date', date)
    Filter.register('time', time)
    const tpl = new Value('foo.bar | date: "b" | time:2', false)
    const scope = new Scope({
      foo: { bar: 'bar' }
    })
    tpl.value(scope)
    expect(date).to.have.been.calledWith('bar', 'b')
    expect(time).to.have.been.calledWith('y', 2)
  })
})
