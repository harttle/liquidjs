import { test, liquid } from '../../stub/render'

describe('liquid#registerFilter()', function () {
  describe('object arguments', function () {
    liquid.registerFilter('obj_test', function () {
      return JSON.stringify(arguments)
    })
    it('should support object', () => test(
      `{{ "a" | obj_test: k1: "v1", k2: foo }}`,
      '{"0":"a","1":["k1","v1"],"2":["k2","bar"]}'
    ))
    it('should support mixed object', () => test(
      `{{ "a" | obj_test: "something", k1: "v1", k2: foo }}`,
      '{"0":"a","1":"something","2":["k1","v1"],"3":["k2","bar"]}'
    ))
  })
})
