import { Liquid } from '../../../src/liquid'

describe('security', () => {
  describe('Object.prototype filter names', () => {
    // Regression: `{{ 1 | valueOf }}` used to resolve to Object.prototype.valueOf
    // and, when invoked as a filter handler, return the FilterImpl `this` — leaking
    // `context`, `liquid`, options, the parser, the loader, etc., enabling RCE.
    it('should treat valueOf as an unregistered filter (identity)', async () => {
      const liquid = new Liquid()
      const out = await liquid.parseAndRender('{% assign r = 1 | valueOf %}{{ r.liquid.options.fs.sep }}|{{ r }}')
      expect(out).toBe('|1')
    })
    it('should not leak FilterImpl via valueOf', async () => {
      const liquid = new Liquid()
      const out = await liquid.parseAndRender('{% assign r = 1 | valueOf %}{{ r.context }}/{{ r.liquid }}/{{ r.token }}')
      expect(out).toBe('//')
    })
    it.each(['toString', 'constructor', 'hasOwnProperty', 'isPrototypeOf', '__proto__', '__defineGetter__'])(
      'should treat %s as an unregistered filter',
      async (name) => {
        const liquid = new Liquid()
        const out = await liquid.parseAndRender(`{{ "x" | ${name} }}`)
        expect(out).toBe('x')
      }
    )
    it('should throw under strictFilters for inherited method names', async () => {
      const liquid = new Liquid({ strictFilters: true })
      await expect(liquid.parseAndRender('{{ 1 | valueOf }}')).rejects.toThrow('undefined filter: valueOf')
    })
  })
  describe('Object.prototype tag names', () => {
    // Regression: `{% constructor %}` used to resolve to Object via tags['constructor'],
    // bypassing the "tag not found" assertion and crashing later with a confusing error.
    it.each(['constructor', 'toString', 'valueOf', 'hasOwnProperty', '__proto__'])(
      'should report %s as unknown tag',
      (name) => {
        const liquid = new Liquid()
        expect(() => liquid.parse(`{% ${name} %}`)).toThrow(`tag "${name}" not found`)
      }
    )
  })
})
