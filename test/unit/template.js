import { resolve } from '../../src/template'
import * as mock from 'mock-fs'
import * as chai from 'chai'
import * as path from 'path'
import * as chaiAsPromised from 'chai-as-promised'

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
      const filepath = resolve('bar.html', '/foo', { root: [] })
      const expected = path.resolve('/foo/bar.html')
      return expect(filepath).to.eventually.equal(expected)
    })
    it('should resolve based on root', function () {
      return expect(resolve('foo.html', '/foo', { root: [] }))
        .to.rejectedWith(/Failed to lookup foo.html in: \/foo/)
    })
  })
})
