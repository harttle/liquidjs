import Liquid from '../../src'
import chai from 'chai'
import sinonChai from 'chai-as-promised'

chai.use(sinonChai)
const expect = chai.expect

describe('tags/assign', function () {
  const liquid = Liquid()
  it('should throw when variable expression illegal', function () {
    const src = '{% assign / %}'
    const ctx = {}
    return expect(liquid.parseAndRender(src, ctx)).to.be.rejectedWith(/illegal/)
  })
  it('should support assign to a string', function () {
    const src = '{% assign foo="bar" %}{{foo}}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('bar')
  })
  it('should support assign to a number', function () {
    const src = '{% assign foo=10086 %}{{foo}}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('10086')
  })
  it('should shading rather than overwriting', function () {
    const ctx = {foo: 'foo'}
    const src = '{% assign foo="FOO" %}{{foo}}'
    return liquid.parseAndRender(src, ctx)
      .then(x => {
        expect(x).to.equal('FOO')
        expect(ctx.foo).to.equal('foo')
      })
  })
  it('should assign as array', function () {
    const src = '{% assign foo=(1..3) %}{{foo}}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('[1,2,3]')
  })
  it('should assign as filter result', function () {
    const src = '{% assign foo="a b" | capitalize | split: " " | first %}{{foo}}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('A')
  })
  it('should assign var-1', function () {
    const src = '{% assign var-1 = 5 %}{{ var-1 }}'
    return expect(liquid.parseAndRender(src)).to.eventually.equal('5')
  })
  it('should assign var-', function () {
    const src = '{% assign var- = 5 %}{{ var- }}'
    return expect(liquid.parseAndRender(src)).to.eventually.equal('5')
  })
  it('should assign -var', function () {
    const src = '{% assign -let = 5 %}{{ -let }}'
    return expect(liquid.parseAndRender(src)).to.eventually.equal('5')
  })
  it('should assign -5-5', function () {
    const src = '{% assign -5-5 = 5 %}{{ -5-5 }}'
    return expect(liquid.parseAndRender(src)).to.eventually.equal('5')
  })
  it('should assign 4-3', function () {
    const src = '{% assign 4-3 = 5 %}{{ 4-3 }}'
    return expect(liquid.parseAndRender(src)).to.eventually.equal('5')
  })
  it('should not assign -6', function () {
    const src = '{% assign -6 = 5 %}{{ -6 }}'
    return expect(liquid.parseAndRender(src)).to.eventually.equal('-6')
  })
})
