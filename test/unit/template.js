import {resolve} from '../../src/template.js'
import mock from 'mock-fs'
import chai from 'chai'
import path from 'path'
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
      const expected = path.resolve('/foo/bar.html')
      return expect(filepath).to.eventually.equal(expected)
    })
    it('should resolve based on root', function () {
      return expect(resolve('foo.html', '/foo', {root: []}))
        .to.rejectedWith(/Failed to lookup foo.html in: \/foo/)
    })
  })
})
