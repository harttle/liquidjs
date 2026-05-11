import { Liquid } from '../../../src/liquid'

describe('liquid#registerFilter()', function () {
  let liquid: Liquid
  beforeEach(() => { liquid = new Liquid() })

  describe('key-value arguments', function () {
    beforeEach(() => {
      liquid.registerFilter('obj_test', function (...args) {
        return JSON.stringify(args)
      })
    })
    it('should support key-value arguments', async () => {
      const src = `{{ "a" | obj_test: k1: "v1", k2: foo }}`
      const dst = '["a",["k1","v1"],["k2","bar"]]'
      const html = await liquid.parseAndRender(src, { foo: 'bar' })
      return expect(html).toBe(dst)
    })
    it('should support mixed arguments', async () => {
      const src = `{{ "a" | obj_test: "something", k1: "v1", k2: foo }}`
      const dst = '["a","something",["k1","v1"],["k2","bar"]]'
      const html = await liquid.parseAndRender(src, { foo: 'bar' })
      return expect(html).toBe(dst)
    })
  })

  describe('async filters', () => {
    it('should support async filter', async () => {
      liquid.registerFilter('get_user_data', function (userId) {
        return Promise.resolve({ userId, userName: userId.toUpperCase() })
      })
      const src = `{{ userId | get_user_data | json }}`
      const dst = '{"userId":"alice","userName":"ALICE"}'
      const html = await liquid.parseAndRender(src, { userId: 'alice' })
      return expect(html).toBe(dst)
    })
  })

  describe('raw filters', () => {
    beforeEach(() => {
      liquid = new Liquid({
        outputEscape: 'escape'
      })
    })
    it('should escape filter output when outputEscape set to true', async () => {
      liquid.registerFilter('break', (str) => str.replace(/\n/g, '<br/>'))
      const src = `{{ "a\nb" | break }}`
      const dst = 'a&lt;br/&gt;b'
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe(dst)
    })
    it('should not escape filter output when registered as "raw"', async () => {
      liquid.registerFilter('break', {
        handler: (str) => str.replace(/\n/g, '<br/>'),
        raw: true
      })
      const src = `{{ "a\nb" | break }}`
      const dst = 'a<br/>b'
      const html = await liquid.parseAndRender(src)
      return expect(html).toBe(dst)
    })
  })

  describe('filter name must not inherit from Object.prototype', () => {
    it('should treat valueOf as unregistered (no FilterImpl leak)', async () => {
      const out = await liquid.parseAndRender(
        '{% assign r = 1 | valueOf %}{{ r.liquid.options.fs.sep }}|{{ r }}'
      )
      expect(out).toBe('|1')
    })
    it('should not expose context, liquid, or token via valueOf', async () => {
      const out = await liquid.parseAndRender(
        '{% assign r = 1 | valueOf %}{{ r.context }}/{{ r.liquid }}/{{ r.token }}'
      )
      expect(out).toBe('//')
    })
    it.each(['toString', 'constructor', 'hasOwnProperty', 'isPrototypeOf', '__proto__', '__defineGetter__'])(
      'should treat %s as unregistered filter',
      async (name) => {
        const out = await liquid.parseAndRender(`{{ "x" | ${name} }}`)
        expect(out).toBe('x')
      }
    )
    it('should throw under strictFilters for valueOf', async () => {
      const strict = new Liquid({ strictFilters: true })
      await expect(strict.parseAndRender('{{ 1 | valueOf }}')).rejects.toThrow('undefined filter: valueOf')
    })
  })
})
