import Liquid from '../..'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

class SettingsDrop extends Liquid.Types.Drop {
  foo: string = 'FOO'
  bar () {
    return 'BAR'
  }
  liquidMethodMissing (key: string) {
    return key.toUpperCase()
  }
}

describe('drop', function () {
  const settings = new SettingsDrop()
  let engine: Liquid
  beforeEach(function () {
    engine = new Liquid()
  })
  it('should support liquidMethodMissing', async function () {
    const src = `{{settings.foo}},{{settings.bar}},{{settings.coo}}`
    const html = await engine.parseAndRender(src, { settings })
    return expect(html).to.equal('FOO,BAR,COO')
  })

  describe('BlandDrop', function () {
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
})
