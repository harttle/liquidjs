import { resolve } from '../../src/parser/template'
import * as path from 'path'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { mock, restore } from '../stub/mockfs'

use(chaiAsPromised)

describe('template', function () {
  before(() => mock({ '/foo/bar.html': 'bar' }))
  after(restore)

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
