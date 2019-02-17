import { expect } from 'chai'
import * as mock from 'mock-fs'
import Liquid from '../..'

describe('#renderFile()', function () {
  var engine
  beforeEach(function () {
    engine = new Liquid({
      root: '/root/',
      extname: '.html'
    })
    mock({
      '/root/files/bar': 'bar',
      '/root/files/foo.html': 'foo',
      '/root/files/name.html': 'My name is {{name}}.',
      '/un-readable.html': mock.file({
        mode: '0000'
      })
    })
  })
  afterEach(function () {
    mock.restore()
  })
  it('should render file', async function () {
    const html = await engine.renderFile('/root/files/foo.html', {})
    return expect(html).to.equal('foo')
  })
  it('should find files without extname', async function () {
    var engine = new Liquid({ root: '/root' })
    const html = await engine.renderFile('/root/files/bar', {})
    return expect(html).to.equal('bar')
  })
  it('should accept relative path', async function () {
    const html = await engine.renderFile('files/foo.html')
    return expect(html).to.equal('foo')
  })
  it('should resolve array as root', async function () {
    engine = new Liquid({
      root: ['/boo', '/root/'],
      extname: '.html'
    })
    const html = await engine.renderFile('files/foo.html')
    return expect(html).to.equal('foo')
  })
  it('should default root to cwd', async function () {
    var files = {}
    files[process.cwd() + '/foo.html'] = 'FOO'
    mock(files)

    engine = new Liquid({
      extname: '.html'
    })
    const html = await engine.renderFile('foo.html')
    return expect(html).to.equal('FOO')
  })
  it('should render file with context', async function () {
    const html = await engine.renderFile('/root/files/name.html', { name: 'harttle' })
    return expect(html).to.equal('My name is harttle.')
  })
  it('should use default extname', async function () {
    const html = await engine.renderFile('files/name', { name: 'harttle' })
    return expect(html).to.equal('My name is harttle.')
  })
  it('should throw with lookup list when file not exist', function () {
    engine = new Liquid({
      root: ['/boo', '/root/'],
      extname: '.html'
    })
    return expect(engine.renderFile('/not/exist.html')).to
      .be.rejectedWith(/failed to lookup \/not\/exist.html in: \/boo,\/root\//i)
  })
  it('should throw when file not readable', function () {
    return expect(engine.renderFile('/un-readable.html')).to
      .be.rejectedWith(/EACCES/)
  })
})
