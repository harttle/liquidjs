import { expect } from 'chai'
import { Liquid } from '../../../src/liquid'

describe('liquid#registerFilter()', function () {
  const liquid = new Liquid()

  describe('key-value arguments', function () {
    liquid.registerFilter('obj_test', function (...args) {
      return JSON.stringify(args)
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
    liquid.registerFilter('get_user_data', function (userId) {
      return Promise.resolve({ userId, userName: userId.toUpperCase() })
    })
    it('should support async filter', async () => {
      const src = `{{ userId | get_user_data | json }}`
      const dst = '{"userId":"alice","userName":"ALICE"}'
      const html = await liquid.parseAndRender(src, { userId: 'alice' })
      return expect(html).to.equal(dst)
    })
  })
})
