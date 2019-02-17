import { expect } from 'chai'
import Liquid from '../..'

describe('.evalValue()', function () {
  var engine
  beforeEach(() => { engine = new Liquid() })

  it('should throw when scope undefined', function () {
    expect(() => engine.evalValue('{{"foo"}}')).to.throw(/scope undefined/)
  })
})
