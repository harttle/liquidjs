import { expect } from 'chai'
import { Liquid, Template } from '../../../src/liquid'
import { mock, restore } from '../../stub/mockfs'

describe('LiquidOptions#cache', function () {
  afterEach(restore)

  describe('#renderFile', function () {
    it('should be disabled by default', async function () {
      const engine = new Liquid({
        root: '/root/',
        extname: '.html'
      })
      mock({ '/root/files/foo.html': 'foo' })
      const x = await engine.renderFile('files/foo')
      expect(x).to.equal('foo')
      mock({ '/root/files/foo.html': 'bar' })
      const y = await engine.renderFile('files/foo')
      expect(y).to.equal('bar')
    })
    it('should be disabled when cache <= 0', async function () {
      const engine = new Liquid({
        root: '/root/',
        extname: '.html',
        cache: -1
      })
      mock({ '/root/files/foo.html': 'foo' })
      const x = await engine.renderFile('files/foo')
      expect(x).to.equal('foo')
      mock({ '/root/files/foo.html': 'bar' })
      const y = await engine.renderFile('files/foo')
      expect(y).to.equal('bar')
    })
    it('should respect cache=true option', async function () {
      const engine = new Liquid({
        root: '/root/',
        extname: '.html',
        cache: true
      })
      mock({ '/root/files/foo.html': 'foo' })
      const x = await engine.renderFile('files/foo')
      expect(x).to.equal('foo')
      mock({ '/root/files/foo.html': 'bar' })
      const y = await engine.renderFile('files/foo')
      expect(y).to.equal('foo')
    })
    it('should respect cache=2 option', async function () {
      const engine = new Liquid({
        root: '/root/',
        extname: '.html',
        cache: 2
      })
      mock({ '/root/files/foo.html': 'foo' })
      mock({ '/root/files/bar.html': 'bar' })
      mock({ '/root/files/coo.html': 'coo' })
      await engine.renderFile('files/foo')
      mock({ '/root/files/foo.html': 'FOO' })
      await engine.renderFile('files/bar')
      const x = await engine.renderFile('files/foo')
      expect(x).to.equal('foo')

      await engine.renderFile('files/bar')
      await engine.renderFile('files/coo')
      const y = await engine.renderFile('files/foo')
      expect(y).to.equal('FOO')
    })
    it('should respect cache={read, write} option', async function () {
      let last: Template[] | undefined
      const engine = new Liquid({
        root: '/root/',
        extname: '.html',
        cache: {
          read: (): Template[] | undefined => last,
          write: (key: string, value: Template[]) => { last = value }
        }
      })
      mock({ '/root/files/foo.html': 'foo' })
      mock({ '/root/files/bar.html': 'bar' })
      mock({ '/root/files/coo.html': 'coo' })
      expect(await engine.renderFile('files/foo')).to.equal('foo')
      expect(await engine.renderFile('files/bar')).to.equal('foo')
      expect(await engine.renderFile('files/coo')).to.equal('foo')
    })
    it('should respect cache={ async read, async write } option', async function () {
      const cached: { [key: string]: Template[] | undefined } = {}
      const engine = new Liquid({
        root: '/root/',
        extname: '.html',
        cache: {
          read: (key: string) => Promise.resolve(cached[key]),
          write: (key: string, value: Template[]) => { cached[key] = value; Promise.resolve() }
        }
      })
      mock({ '/root/files/foo.html': 'foo' })
      mock({ '/root/files/bar.html': 'bar' })
      mock({ '/root/files/coo.html': 'coo' })
      expect(await engine.renderFile('files/foo')).to.equal('foo')
      expect(await engine.renderFile('files/bar')).to.equal('bar')
      expect(await engine.renderFile('files/coo')).to.equal('coo')
      mock({ '/root/files/coo.html': 'COO' })
      expect(await engine.renderFile('files/coo')).to.equal('coo')
    })
    it('should handle concurrent cache read/write', async function () {
      const engine = new Liquid({
        root: '/root/',
        extname: '.html',
        cache: 1
      })
      mock({ '/root/files/foo.html': 'foo' })
      mock({ '/root/files/bar.html': 'bar' })
      mock({ '/root/files/coo.html': 'coo' })
      const [foo1, foo2, bar, coo] = await Promise.all([
        engine.renderFile('files/foo'),
        engine.renderFile('files/foo'),
        engine.renderFile('files/bar'),
        engine.renderFile('files/coo')
      ])
      expect(foo1).to.equal('foo')
      expect(foo2).to.equal('foo')
      expect(bar).to.equal('bar')
      expect(coo).to.equal('coo')
    })
    it('should not cache not exist file', async function () {
      const engine = new Liquid({
        root: '/root/',
        extname: '.html',
        cache: true
      })
      try { await engine.renderFile('foo') } catch (err) {}

      mock({ '/root/foo.html': 'foo' })
      const y = await engine.renderFile('foo')
      expect(y).to.equal('foo')
    })
  })

  describe('#renderFileSync', function () {
    it('should be disabled by default', function () {
      const engine = new Liquid({
        root: '/root/',
        extname: '.html'
      })
      mock({ '/root/foo.html': 'foo' })
      const x = engine.renderFileSync('foo')
      expect(x).to.equal('foo')

      mock({ '/root/foo.html': 'bar' })
      const y = engine.renderFileSync('foo')
      expect(y).to.equal('bar')
    })
    it('should respect cache=true option', function () {
      const engine = new Liquid({
        root: '/root/',
        extname: '.html',
        cache: true
      })
      mock({ '/root/foo.html': 'foo' })
      expect(engine.renderFileSync('foo')).to.equal('foo')
      mock({ '/root/foo.html': 'bar' })
      expect(engine.renderFileSync('foo')).to.equal('foo')
    })
    it('should not cache not exist file', async function () {
      const engine = new Liquid({
        root: '/root/',
        extname: '.html',
        cache: true
      })
      try { engine.renderFileSync('foo') } catch (err) {}

      mock({ '/root/foo.html': 'foo' })
      const y = await engine.renderFile('foo')
      expect(y).to.equal('foo')
    })
    it('should cache relative referenced files properly', async function () {
      const engine = new Liquid({
        root: '/root/',
        extname: '.html',
        cache: true
      })
      mock({
        '/root/foo.html': '{% render "./bar" %}',
        '/root/bar.html': 'bar1',
        '/root/another/foo.html': '{% render "./bar" %}',
        '/root/another/bar.html': 'bar2'
      })
      const foo1 = await engine.renderFile('foo')
      expect(foo1).to.equal('bar1')

      const foo2 = await engine.renderFile('another/foo')
      expect(foo2).to.equal('bar2')
    })
  })
})
