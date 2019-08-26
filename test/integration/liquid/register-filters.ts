import { expect } from 'chai'
import { Liquid } from '../../../src/liquid'

describe('liquid#registerFilter()', function () {
  const liquid = new Liquid()

  describe('object arguments', function () {
    liquid.registerFilter('obj_test', function (...args) {
      return JSON.stringify(args)
    })
    it('should support object', async () => {
      const src = `{{ "a" | obj_test: k1: "v1", k2: foo }}`,
      const dst = '["a",["k1","v1"],["k2","bar"]]'
      const html = await liquid.parseAndRender(src, { foo: 'bar' })
      return expect(html).to.equal(dst)
    })
    it('should support mixed object', async () => {
      const src = `{{ "a" | obj_test: "something", k1: "v1", k2: foo }}`,
      const dst = '["a","something",["k1","v1"],["k2","bar"]]'
      const html = await liquid.parseAndRender(src, { foo: 'bar' })
      return expect(html).to.equal(dst)
    })
  })
})
