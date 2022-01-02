import { Liquid } from '../../../../src/liquid'
import { expect } from 'chai'

describe('filters/object', function () {
  const liquid = new Liquid()
  describe('default', function () {
    it('false should use default', async () => expect(await liquid.parseAndRender('{{false | default: "a"}}')).to.equal('a'))
    it('empty string should use default', async () => expect(await liquid.parseAndRender('{{"" | default: "a"}}')).to.equal('a'))
    it('empty array should use default', async () => expect(await liquid.parseAndRender('{{arr | default: "a"}}', { arr: [] })).to.equal('a'))
    it('non-empty string should not use default', async () => expect(await liquid.parseAndRender('{{" " | default: "a"}}')).to.equal(' '))
    it('nil should use default', async () => expect(await liquid.parseAndRender('{{nil | default: "a"}}')).to.equal('a'))
    it('undefined should use default', async () => expect(await liquid.parseAndRender('{{not_defined | default: "a"}}')).to.equal('a'))
    it('true should not use default', async () => expect(await liquid.parseAndRender('{{true | default: "a"}}')).to.equal('true'))
    it('0 should not use default', async () => expect(await liquid.parseAndRender('{{0 | default: "a"}}')).to.equal('0'))
    it('should output false when allow_false=true', async () => expect(await liquid.parseAndRender('{{false | default: true, allow_false: true}}')).to.equal('false'))
    it('should output default without allow_false', async () => expect(await liquid.parseAndRender('{{false | default: true}}')).to.equal('true'))
    it('should output default when allow_false=false', async () => expect(await liquid.parseAndRender('{{false | default: true, allow_false: false}}')).to.equal('true'))
  })
  describe('json', function () {
    it('should stringify string', async () => expect(await liquid.parseAndRender('{{"foo" | json}}')).to.equal('"foo"'))
    it('should stringify number', async () => expect(await liquid.parseAndRender('{{2 | json}}')).to.equal('2'))
    it('should stringify object', async () => expect(await liquid.parseAndRender('{{obj | json}}', { obj: { foo: 'bar' } })).to.equal('{"foo":"bar"}'))
    it('should stringify array', async () => expect(await liquid.parseAndRender('{{arr | json}}', { arr: [-2, 'a'] })).to.equal('[-2,"a"]'))
  })
})
