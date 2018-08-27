import {resolve} from '../../src/template.js'
import mock from 'mock-fs'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

const expect = chai.expect
chai.use(chaiAsPromised)

describe('template', function () {
  before(function () {
    mock({
      '/foo/bar.html': 'bar'
    })
  })
  describe('#resolve()', function () {
    it('should resolve based on root', function () {
      const filepath = resolve('bar.html', '/foo', {root: []})
      return expect(filepath).to.eventually.equal('/foo/bar.html')
    })
    it('should resolve based on root', function () {
      return expect(resolve('foo.html', '/foo', {root: []}))
        .to.rejectedWith(/Failed to lookup foo.html in: \/foo/)
    })
  })
})
