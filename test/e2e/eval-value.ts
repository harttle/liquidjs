var chai = require('chai')
var Liquid = require('../..')
var expect = chai.expect

chai.use(require('chai-as-promised'))

describe('.evalValue()', function () {
  var engine
  beforeEach(() => engine = new Liquid())

  it('should throw when scope undefined', function () {
    expect(() => engine.evalValue('{{"foo"}}')).to.throw(/scope undefined/)
  })
})
