import * as chai from 'chai'
import { QuotedToken } from '../../../src/tokens/quoted-token'
import { toThenable } from '../../../src/util/async'
import { FilterMap } from '../../../src/template/filter/filter-map'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import { Context } from '../../../src/context/context'
import { Value } from '../../../src/template/value'

chai.use(sinonChai)

const expect = chai.expect

describe('Value', function () {
  const liquid = {} as any

  describe('#constructor()', function () {
    const filterMap = new FilterMap(false, liquid)
    it('should parse "foo', function () {
      const tpl = new Value('foo', filterMap, liquid)
      expect(tpl.initial!.getText()).to.equal('foo')
      expect(tpl.filters).to.deep.equal([])
    })
    it('should parse filters in value content', function () {
      const f = new Value('o | foo: a: "a"', filterMap, liquid)
      expect(f.filters[0].name).to.equal('foo')
      expect(f.filters[0].args).to.have.lengthOf(1)
      const [k, v] = f.filters[0].args[0] as any
      expect(k).to.equal('a')
      expect(v).to.be.instanceOf(QuotedToken)
      expect((v as QuotedToken).getText()).to.equal('"a"')
    })
  })

  describe('#value()', function () {
    it('should call chained filters correctly', async function () {
      const date = sinon.stub().returns('y')
      const time = sinon.spy()
      const filterMap = new FilterMap(false, liquid)
      filterMap.set('date', date)
      filterMap.set('time', time)
      const tpl = new Value('foo.bar | date: "b" | time:2', filterMap, liquid)
      const scope = new Context({
        foo: { bar: 'bar' }
      })
      await toThenable(tpl.value(scope))
      expect(date).to.have.been.calledWith('bar', 'b')
      expect(time).to.have.been.calledWith('y', 2)
    })
  })
})
