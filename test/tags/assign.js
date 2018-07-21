'use strict'
const Liquid = require('../..')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/assign', function () {
  let liquid = Liquid()
  it('should throw when variable expression illegal', function () {
    let src = '{% assign / %}'
    let ctx = {}
    return expect(liquid.parseAndRender(src, ctx)).to.be.rejectedWith(/illegal/)
  })
  it('should support assign to a string', function () {
    let src = '{% assign foo="bar" %}{{foo}}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('bar')
  })
  it('should support assign to a number', function () {
    let src = '{% assign foo=10086 %}{{foo}}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('10086')
  })
  it('should shading rather than overwriting', function () {
    let ctx = {foo: 'foo'}
    let src = '{% assign foo="FOO" %}{{foo}}'
    return liquid.parseAndRender(src, ctx)
      .then(x => {
        expect(x).to.equal('FOO')
        expect(ctx.foo).to.equal('foo')
      })
  })
  it('should assign as array', function () {
    let src = '{% assign foo=(1..3) %}{{foo}}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('[1,2,3]')
  })
  it('should assign as filter result', function () {
    let src = '{% assign foo="a b" | capitalize | split: " " | first %}{{foo}}'
    return expect(liquid.parseAndRender(src))
      .to.eventually.equal('A')
  })
  it('should assign var-1', function () {
    let src = '{% assign var-1 = 5 %}{{ var-1 }}'
    return expect(liquid.parseAndRender(src)).to.eventually.equal('5')
  })
  it('should assign var-', function () {
    let src = '{% assign var- = 5 %}{{ var- }}'
    return expect(liquid.parseAndRender(src)).to.eventually.equal('5')
  })
  it('should assign -var', function () {
    let src = '{% assign -let = 5 %}{{ -let }}'
    return expect(liquid.parseAndRender(src)).to.eventually.equal('5')
  })
  it('should assign -5-5', function () {
    let src = '{% assign -5-5 = 5 %}{{ -5-5 }}'
    return expect(liquid.parseAndRender(src)).to.eventually.equal('5')
  })
  it('should assign 4-3', function () {
    let src = '{% assign 4-3 = 5 %}{{ 4-3 }}'
    return expect(liquid.parseAndRender(src)).to.eventually.equal('5')
  })
  it('should not assign -6', function () {
    let src = '{% assign -6 = 5 %}{{ -6 }}'
    return expect(liquid.parseAndRender(src)).to.eventually.equal('-6')
  })
})
