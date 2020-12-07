import { expect } from 'chai'
import { Liquid } from '../..'

describe('#evalValueSync()', function () {
  var engine: Liquid
  beforeEach(() => { engine = new Liquid() })

  it('should eval value syncly', async function () {
    return expect(engine.evalValueSync('true', { opts: {} } as any)).to.equal(true)
  })
})
