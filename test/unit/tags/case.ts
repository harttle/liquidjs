import Liquid from 'src/liquid'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('tags/case', function () {
  const liquid = new Liquid()

  it('should reject if not closed', function () {
    const src = '{% case "foo"%}'
    return expect(liquid.parseAndRender(src))
      .to.be.rejectedWith(/{% case "foo"%} not closed/)
  })
  it('should hit the specified case', async function () {
    const src = '{% case "foo"%}' +
            '{% when "foo" %}foo{% when "bar"%}bar' +
            '{%endcase%}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('foo')
  })
  it('should resolve empty string if not hit', async function () {
    const src = '{% case empty %}' +
            '{% when "foo" %}foo{% when ""%}bar' +
            '{%endcase%}'
    const ctx = {
      empty: ''
    }
    const html = await liquid.parseAndRender(src, ctx)
    return expect(html).to.equal('bar')
  })
  it('should accept empty string as branch name', async function () {
    const src = '{% case false %}' +
            '{% when "foo" %}foo{% when ""%}bar' +
            '{%endcase%}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('')
  })
  it('should support boolean case', async function () {
    const src = '{% case false %}' +
            '{% when "foo" %}foo{% when false%}bar' +
            '{%endcase%}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('bar')
  })
  it('should support else branch', async function () {
    const src = '{% case "a" %}' +
            '{% when "b" %}b{% when "c"%}c{%else %}d' +
            '{%endcase%}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('d')
  })
})
