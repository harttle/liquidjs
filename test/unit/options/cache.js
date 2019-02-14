import * as chai from 'chai'
import * as mock from 'mock-fs'
import Liquid from '../../../src'
import * as chaiAsPromised from 'chai-as-promised'

const expect = chai.expect
chai.use(chaiAsPromised)

describe('cache options', function () {
  let engine
  beforeEach(function () {
    engine = Liquid({
      root: '/root/',
      extname: '.html'
    })
    mock({ '/root/files/foo.html': 'foo' })
  })
  afterEach(function () {
    mock.restore()
  })
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
    engine = Liquid({
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
