import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import Scope from '../../src/scope/scope'
import Filter from 'src/template/filter'
import Value from 'src/template/value'

chai.use(sinonChai)
chai.use(chaiAsPromised)

const expect = chai.expect
const add = (l, r) => l + r

describe('Value', function () {
  beforeEach(() => Filter.clear())

  it('should throw when value string illegal', function () {
    expect(function () {
      new Value('/')
    }).to.throw(/illegal value string/)
  })

  it('should parse value string', function () {
    const tpl: any = new Value('foo')
    expect(tpl.initial).to.equal('foo')
    expect(tpl.filters).to.deep.equal([])
  })

  it('should parse value string with a simple filter', function () {
    Filter.register('add', add)
    const tpl: any = new Value('foo | add: 3, "foo"')
    expect(tpl.initial).to.equal('foo')
    expect(tpl.filters.length).to.equal(1)
    expect(tpl.filters[0].impl).to.equal(add)
  })

  it('should parse value string with filters', function () {
    const tpl: any = new Value('foo | add: "|" | add')
    expect(tpl.initial).to.equal('foo')
    expect(tpl.filters.length).to.equal(2)
  })


  it('should eval value', function () {
    Filter.register('date', (l, r) => l + r)
    Filter.register('time', (l, r) => l + 3 * r)
    const tpl = new Value('foo.bar[0] | date: "b" | time:2')
    const scope = new Scope({
      foo: { bar: ['a'] }
    })
    expect(tpl.value(scope)).to.equal('ab6')
  })
  it('should reserve type', function () {
    Filter.register('arr', () => [1])
    const tpl = new Value('"x" | arr')
    expect(tpl.value(new Scope())).to.deep.equal([1])
  })
  it('should eval filter with correct arguments', function () {
    const date = sinon.stub().returns('y')
    const time = sinon.spy()
    Filter.register('date', date)
    Filter.register('time', time)
    const tpl = new Value('foo.bar | date: "b" | time:2')
    const scope = new Scope({
      foo: { bar: 'bar' }
    })
    tpl.value(scope)
    expect(date).to.have.been.calledWith('bar', 'b')
    expect(time).to.have.been.calledWith('y', 2)
  })
})
