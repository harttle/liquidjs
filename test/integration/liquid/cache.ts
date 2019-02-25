import { expect } from 'chai'
import Liquid from '../../../src/liquid'
import { mock, restore } from '../../stub/mockfs'

describe('LiquidOptions#cache', function () {
  let engine: Liquid
  beforeEach(function () {
    engine = new Liquid({
      root: '/root/',
      extname: '.html'
    })
    mock({ '/root/files/foo.html': 'foo' })
  })
  afterEach(restore)
  it('should be disabled by default', function () {
    return engine.renderFile('files/foo')
      .then(x => expect(x).to.equal('foo'))
      .then(() => mock({
        '/root/files/foo.html': 'bar'
      }))
      .then(() => engine.renderFile('files/foo'))
      .then(x => expect(x).to.equal('bar'))
  })
  it('should respect cache=true option', function () {
    engine = new Liquid({
      root: '/root/',
      extname: '.html',
      cache: true
    })
    return engine.renderFile('files/foo')
      .then(x => expect(x).to.equal('foo'))
      .then(() => mock({
        '/root/files/foo.html': 'bar'
      }))
      .then(() => engine.renderFile('files/foo'))
      .then(x => expect(x).to.equal('foo'))
  })
})
