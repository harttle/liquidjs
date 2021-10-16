import { Liquid } from '../..'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { resolve } from 'path'

use(chaiAsPromised)

describe('#renderFile()', function () {
  const root = resolve(__dirname, '../stub/root')
  const views = resolve(__dirname, '../stub/views')
  let engine: Liquid
  beforeEach(function () {
    engine = new Liquid({
      root,
      extname: '.html'
    })
  })
  it('should render file', async function () {
    const html = await engine.renderFile(resolve(root, 'foo.html'), {})
    return expect(html).to.equal('foo')
  })
  it('should find files without extname', async function () {
    var engine = new Liquid({ root })
    const html = await engine.renderFile(resolve(root, 'bar'), {})
    return expect(html).to.equal('bar')
  })
  it('should accept relative path', async function () {
    const html = await engine.renderFile('foo.html')
    return expect(html).to.equal('foo')
  })
  it('should traverse root array', async function () {
    engine = new Liquid({
      root: ['/boo', root],
      extname: '.html'
    })
    const html = await engine.renderFile('foo.html')
    return expect(html).to.equal('foo')
  })
  it('should default root to cwd', async function () {
    engine = new Liquid()
    const html = await engine.renderFile('package.json')
    return expect(html).to.contain('"name": "liquidjs"')
  })
  it('should render file with context', async function () {
    const html = await engine.renderFile(resolve(views, 'name.html'), { name: 'harttle' })
    return expect(html).to.equal('My name is harttle.')
  })
  it('should use default extname', async function () {
    const html = await engine.renderFile(resolve(root, 'foo'))
    return expect(html).to.equal('foo')
  })
  it('should throw with lookup list when file not exist', function () {
    engine = new Liquid({
      root: ['/boo', '/root/'],
      extname: '.html'
    })
    return expect(engine.renderFile('/not/exist.html')).to
      .be.rejectedWith(/Failed to lookup "\/not\/exist.html" in "\/boo,\/root\/"/)
  })
})
