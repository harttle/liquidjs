import { resolve } from '../../src/parser/template'
import * as mock from 'mock-fs'
import { expect } from 'chai'
import * as path from 'path'

describe('template', function () {
  before(function () {
    mock({
      '/foo/bar.html': 'bar'
    })
  })
  describe('#resolve()', function () {
    it('should resolve based on root', async function () {
      const filepath = await resolve('bar.html', '/foo', { root: [] })
      const expected = path.resolve('/foo/bar.html')
      return expect(filepath).to.equal(expected)
    })
    it('should resolve based on root', function () {
      return expect(resolve('foo.html', '/foo', { root: [] }))
        .to.rejectedWith(/Failed to lookup foo.html in: \/foo/)
    })
  })
})
