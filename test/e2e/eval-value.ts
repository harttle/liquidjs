import { expect } from 'chai'
import Liquid from '../..'

describe('.evalValue()', function () {
  var engine: Liquid
  beforeEach(() => { engine = new Liquid() })

  it('should throw when scope undefined', function () {
    expect(() => engine.evalValue('{{"foo"}}', null as any)).to.throw(/scope undefined/)
  })
})
