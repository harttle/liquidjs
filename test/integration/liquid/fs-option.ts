import { expect } from 'chai'
import { Liquid } from '../../../src/liquid'

describe('LiquidOptions#fs', function () {
  let engine: Liquid
  const fs = {
    exists: () => Promise.resolve(true),
    readFile: () => Promise.resolve('test file content'),
    resolve: () => 'resolved'
  }
  beforeEach(function () {
    engine = new Liquid({
      root: '/root/',
      fs
    })
  })
  it('should be used to read templates', function () {
    return engine.renderFile('files/foo')
      .then(x => expect(x).to.equal('test file content'))
  })
})
