import { Context, Drop, Liquid } from '../..'

describe('drop', function () {
  let engine: Liquid
  beforeEach(function () {
    engine = new Liquid()
  })

  describe('liquidMethodMissing', () => {
    it('should support liquidMethodMissing', async function () {
      class SettingsDrop extends Drop {
        public foo = 'FOO'
        public bar () {
          return 'BAR'
        }
        public liquidMethodMissing (key: string) {
          return key.toUpperCase()
        }
      }
      const src = `{{settings.foo}},{{settings.bar}},{{settings.coo}}`
      const html = await engine.parseAndRender(src, { settings: new SettingsDrop() })
      return expect(html).toBe('FOO,BAR,COO')
    })

    it('should expose context', async function () {
      class SettingsDrop extends Drop {
        public liquidMethodMissing (key: string, context: Context) {
          return key + ':' + context.getSync([key])
        }
      }
      const src = `{{settings.foo}}`
      const html = await engine.parseAndRender(src, { settings: new SettingsDrop(), foo: 'FOO' })
      return expect(html).toBe('foo:FOO')
    })
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
