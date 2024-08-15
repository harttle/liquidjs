import { Drop, Liquid } from '../..'

class SettingsDrop extends Drop {
  public foo = 'FOO'
  public bar () {
    return 'BAR'
  }
  public liquidMethodMissing (key: string) {
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
    return expect(html).toBe('FOO,BAR,COO')
  })

  describe('BlandDrop', function () {
    it('should test blank strings', async function () {
      const src = `
      {% unless settings.fpHeading == blank %}
          <h1>{{ settings.fpHeading }}</h1>
      {% endunless %}`
      var ctx = { settings: { fpHeading: '' } }
      const html = await engine.parseAndRender(src, ctx)
      return expect(html).toMatch(/^\s+$/)
    })
  })
})
