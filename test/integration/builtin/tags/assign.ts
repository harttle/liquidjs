import Liquid from '../../../../src/liquid'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('tags/assign', function () {
  const liquid = new Liquid()
  it('should throw when variable expression illegal', function () {
    const src = '{% assign / %}'
    const ctx = {}
    return expect(liquid.parseAndRender(src, ctx)).to.be.rejectedWith(/illegal/)
  })
  it('should support assign to a string', async function () {
    const src = '{% assign foo="bar" %}{{foo}}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('bar')
  })
  it('should support assign to a number', async function () {
    const src = '{% assign foo=10086 %}{{foo}}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('10086')
  })
  it('should shading rather than overwriting', async function () {
    const ctx = { foo: 'foo' }
    const src = '{% assign foo="FOO" %}{{foo}}'
    const html = await liquid.parseAndRender(src, ctx)
    expect(html).to.equal('FOO')
    expect(ctx.foo).to.equal('foo')
  })
  it('should assign as array', async function () {
    const src = '{% assign foo=(1..3) %}{{foo}}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('[1,2,3]')
  })
  it('should assign as filter result', async function () {
    const src = '{% assign foo="a b" | capitalize | split: " " | first %}{{foo}}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('A')
  })
  it('should assign as filter across multiple lines as result', async function () {
    const src = `{% assign foo="a b"
    | capitalize
    | split: " "
    | first %}{{foo}}`
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('A')
  })
  it('should assign var-1', async function () {
    const src = '{% assign var-1 = 5 %}{{ var-1 }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('5')
  })
  it('should assign var-', async function () {
    const src = '{% assign var- = 5 %}{{ var- }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('5')
  })
  it('should assign -var', async function () {
    const src = '{% assign -let = 5 %}{{ -let }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('5')
  })
  it('should assign -5-5', async function () {
    const src = '{% assign -5-5 = 5 %}{{ -5-5 }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('5')
  })
  it('should assign 4-3', async function () {
    const src = '{% assign 4-3 = 5 %}{{ 4-3 }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('5')
  })
  it('should not assign -6', async function () {
    const src = '{% assign -6 = 5 %}{{ -6 }}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('-6')
  })
})
