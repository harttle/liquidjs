import { resolve } from '../../src/parser/template'
import * as path from 'path'
import { fs } from 'src/parser/template'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('template', function () {
  let readFile, stat
  before(function () {
    readFile = fs.readFile
    stat = fs.stat
    fs.readFile = async function (file) {
      if (file === '/foo/bar.html') return 'bar'
      throw new Error('NOENT')
    }
    fs.stat = async function (file) {
      if (file === '/foo/bar.html') return { type: 'file' }
      throw new Error('NOENT')
    }
  })
  after(function () {
    fs.readFile = readFile
    fs.stat = stat
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
