import { expect } from 'chai'
import { Liquid } from '../..'

describe('#evalValueSync()', function () {
  var engine: Liquid
  beforeEach(() => { engine = new Liquid() })

  it('should throw when scope undefined', async function () {
    return expect(() => engine.evalValueSync('{{"foo"}}', null as any)).to.throw(/context not defined/)
  })
})
