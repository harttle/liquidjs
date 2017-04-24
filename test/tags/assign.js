const Liquid = require('../..')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/assign', function () {
  var liquid = Liquid()
  it('should throw when variable expression illegal', function () {
    var src = '{% assign / %}'
    var ctx = {}
    return expect(liquid.parseAndRender(src, ctx)).to.be.rejectedWith(/illegal/)
  })

  it('should assign as string', function () {
    var src = '{% assign foo="bar" %}{{foo}}'
    return expect(liquid.parseAndRender(src))
            .to.eventually.equal('bar')
  })
  it('should assign as array', function () {
    var src = '{% assign foo=(1..3) %}{{foo}}'
    return expect(liquid.parseAndRender(src))
            .to.eventually.equal('[1,2,3]')
  })
  it('should assign as filter result', function () {
    var src = '{% assign foo="a b" | capitalize | split: " " | first %}{{foo}}'
    return expect(liquid.parseAndRender(src))
            .to.eventually.equal('A')
  })
  it('should assign var-1', function () {
    var src = '{% assign var-1 = 5 %}{{ var-1 }}'
    return expect(liquid.parseAndRender(src)).to.eventually.equal('5')
  })
  it('should assign var-', function () {
    var src = '{% assign var- = 5 %}{{ var- }}'
    return expect(liquid.parseAndRender(src)).to.eventually.equal('5')
  })
  it('should assign -var', function () {
    var src = '{% assign -var = 5 %}{{ -var }}'
    return expect(liquid.parseAndRender(src)).to.eventually.equal('5')
  })
  it('should assign -5-5', function () {
    var src = '{% assign -5-5 = 5 %}{{ -5-5 }}'
    return expect(liquid.parseAndRender(src)).to.eventually.equal('5')
  })
  it('should assign 4-3', function () {
    var src = '{% assign 4-3 = 5 %}{{ 4-3 }}'
    return expect(liquid.parseAndRender(src)).to.eventually.equal('5')
  })
  it('should not assign -6', function () {
    var src = '{% assign -6 = 5 %}{{ -6 }}'
    return expect(liquid.parseAndRender(src)).to.eventually.equal('-6')
  })
})
