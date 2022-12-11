import { expect } from 'chai'
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
      return expect(html).to.equal(dst)
    })
    it('should support mixed arguments', async () => {
      const src = `{{ "a" | obj_test: "something", k1: "v1", k2: foo }}`
      const dst = '["a","something",["k1","v1"],["k2","bar"]]'
      const html = await liquid.parseAndRender(src, { foo: 'bar' })
      return expect(html).to.equal(dst)
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
      return expect(html).to.equal(dst)
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
      return expect(html).to.equal(dst)
    })
    it('should not escape filter output when registered as "raw"', async () => {
      liquid.registerFilter('break', {
        handler: (str) => str.replace(/\n/g, '<br/>'),
        raw: true
      })
      const src = `{{ "a\nb" | break }}`
      const dst = 'a<br/>b'
      const html = await liquid.parseAndRender(src)
      return expect(html).to.equal(dst)
    })
  })
})
