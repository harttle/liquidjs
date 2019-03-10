import { expect } from 'chai'
import Liquid from '../..'

describe('.evalValue()', function () {
  var engine: Liquid
  beforeEach(() => { engine = new Liquid() })

  it('should throw when scope undefined', async function () {
    return expect(engine.evalValue('{{"foo"}}', null as any)).to.be.rejectedWith(/scope undefined/)
  })
})
