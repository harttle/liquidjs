import Liquid from '../..'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('drop', function () {
  var engine: Liquid
  beforeEach(function () {
    engine = new Liquid()
  })
  it('should support liquid_method_missing', async function () {
    let i = 0
    const src = `{{settings.foo}},{{settings.foo}},{{settings.foo}}`
    const ctx = { settings: { liquid_method_missing: () => i++ } }
    const html = await engine.parseAndRender(src, ctx)
    return expect(html).to.equal('0,1,2')
  })
  it('should test blank strings', async function () {
    const src = `
    {% unless settings.fp_heading == blank %}
        <h1>{{ settings.fp_heading }}</h1>
    {% endunless %}`
    var ctx = { settings: { fp_heading: '' } }
    const html = await engine.parseAndRender(src, ctx)
    return expect(html).to.match(/^\s+$/)
  })
})
