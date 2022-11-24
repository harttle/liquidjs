import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { Liquid, Context, isFalsy } from '../../../src'
import { mock, restore } from '../../stub/mockfs'
import { drainStream } from '../../stub/stream'

const expect = chai.expect
chai.use(chaiAsPromised)

describe('Liquid', function () {
  describe('#plugin()', function () {
    it('should call plugin on the instance', async function () {
      const engine = new Liquid()
      engine.plugin(function () {
        this.registerFilter('foo', x => `foo${x}foo`)
      })
      const html = await engine.parseAndRender('{{"bar"|foo}}')
      expect(html).to.equal('foobarfoo')
    })
    it('should call plugin with Liquid', async function () {
      const engine = new Liquid()
      engine.plugin(function () {
        this.registerFilter('t', function (v) { return isFalsy(v, this.context) })
      })
      const html = await engine.parseAndRender('{{false|t}}')
      expect(html).to.equal('true')
    })
  })
  describe('#parseAndRender', function () {
    const engine = new Liquid()
    it('should parse and render variable output', async function () {
      const html = await engine.parseAndRender('{{"foo"}}')
      expect(html).to.equal('foo')
    })
    it('should parse and render complex output', async function () {
      const tpl = '{{ "Welcome|to]Liquid" | split: "|" | join: "("}}'
      const html = await engine.parseAndRender(tpl)
      expect(html).to.equal('Welcome(to]Liquid')
    })
    it('should support for-in with variable', async function () {
      const src = '{% assign total = 3 | minus: 1 %}' +
        '{% for i in (1..total) %}{{ i }}{% endfor %}'
      const html = await engine.parseAndRender(src, {})
      return expect(html).to.equal('12')
    })
    it('should support `globals` render option', async function () {
      const src = '{{ foo }}'
      const html = await engine.parseAndRender(src, {}, { globals: { foo: 'FOO' } })
      return expect(html).to.equal('FOO')
    })
    it('should support `strictVariables` render option', function () {
      const src = '{{ foo }}'
      return expect(engine.parseAndRender(src, {}, { strictVariables: true })).rejectedWith(/undefined variable/)
    })
    it('should support async variables in output', async () => {
      const src = '{{ foo }}'
      const html = await engine.parseAndRender(src, { foo: Promise.resolve('FOO') })
      expect(html).to.equal('FOO')
    })
  })
  describe('#parseAndRenderSync', function () {
    const engine = new Liquid()
    it('should parse and render variable output', function () {
      const html = engine.parseAndRenderSync('{{"foo"}}')
      expect(html).to.equal('foo')
    })
    it('should parse and render complex output', function () {
      const tpl = '{{ "Welcome|to]Liquid" | split: "|" | join: "("}}'
      const html = engine.parseAndRenderSync(tpl)
      expect(html).to.equal('Welcome(to]Liquid')
    })
    it('should support for-in with variable', function () {
      const src = '{% assign total = 3 | minus: 1 %}' +
        '{% for i in (1..total) %}{{ i }}{% endfor %}'
      const html = engine.parseAndRenderSync(src, {})
      return expect(html).to.equal('12')
    })
    it('should support `globals` render option', function () {
      const src = '{{ foo }}'
      const html = engine.parseAndRenderSync(src, {}, { globals: { foo: 'FOO' } })
      return expect(html).to.equal('FOO')
    })
    it('should support `strictVariables` render option', function () {
      const src = '{{ foo }}'
      return expect(() => engine.parseAndRenderSync(src, {}, { strictVariables: true })).throw(/undefined variable/)
    })
  })
  describe('#express()', function () {
    const liquid = new Liquid({ root: '/root' })
    const render = liquid.express()
    before(function () {
      mock({
        '/root/foo': 'foo'
      })
    })
    after(restore)
    it('should render single template', function (done) {
      render.call({ root: '/root' }, 'foo', null as any, (err: Error | null, result: string | undefined) => {
        if (err) return done(err)
        expect(result).to.equal('foo')
        done()
      })
    })
    it('should render single template with Array-typed root', function (done) {
      render.call({ root: ['/root'] }, 'foo', null as any, (err: Error | null, result: string | undefined) => {
        if (err) return done(err)
        expect(result).to.equal('foo')
        done()
      })
    })
  })
  describe('#renderFile', function () {
    it('should throw with lookup list when file not exist', function () {
      const engine = new Liquid({
        root: ['/boo', '/root/'],
        extname: '.html'
      })
      return expect(engine.renderFile('/not/exist.html')).to
        .be.rejectedWith(/Failed to lookup "\/not\/exist.html" in "\/boo,\/root\/"/)
    })
  })
  describe('#parseFile', function () {
    it('should throw with lookup list when file not exist', function () {
      const engine = new Liquid({
        root: ['/boo', '/root/'],
        extname: '.html'
      })
      return expect(engine.parseFile('/not/exist.html')).to
        .be.rejectedWith(/Failed to lookup "\/not\/exist.html" in "\/boo,\/root\/"/)
    })
    it('should fallback to require.resolve in Node.js', async function () {
      const engine = new Liquid({
        root: ['/root/'],
        extname: '.html'
      })
      const tpls = await engine.parseFileSync('mocha')
      expect(tpls.length).to.gte(1)
      expect(tpls[0].token.getText()).to.contain('module.exports')
    })
  })
  describe('#evalValue', function () {
    it('should eval string literal', async function () {
      const engine = new Liquid()
      const ctx = new Context()
      const str = await engine.evalValue('"foo"', ctx)
      expect(str).to.equal('foo')
    })
  })
  describe('#evalValueSync', function () {
    it('should eval string literal', function () {
      const engine = new Liquid()
      const ctx = new Context()
      const str = engine.evalValueSync('"foo"', ctx)
      expect(str).to.equal('foo')
    })
  })
  describe('#parse', function () {
    it('should resolve relative partials', function () {
      const engine = new Liquid({
        root: ['/'],
        extname: '.html'
      })
      mock({
        '/root/partial.html': 'foo'
      })
      const tpls = engine.parse('{% render "./partial.html" %}', '/root/index.html')
      return expect(engine.renderSync(tpls)).to.equal('foo')
    })
    it('should resolve against pwd for relative filepath', function () {
      const engine = new Liquid({
        root: ['/'],
        extname: '.html'
      })
      mock({
        [`${process.cwd()}/partial.html`]: 'foo'
      })
      const tpls = engine.parse('{% render "./partial.html" %}', './index.html')
      return expect(engine.renderSync(tpls)).to.equal('foo')
    })
  })
  describe('#parseFileSync', function () {
    it('should throw with lookup list when file not exist', function () {
      const engine = new Liquid({
        root: ['/boo', '/root/'],
        extname: '.html'
      })
      return expect(() => engine.parseFileSync('/not/exist.html'))
        .to.throw(/Failed to lookup "\/not\/exist.html" in "\/boo,\/root\/"/)
    })
    it('should throw with lookup list when file not exist', function () {
      const engine = new Liquid({
        root: ['/boo', '/root/'],
        extname: '.html'
      })
      return expect(() => engine.parseFileSync('/not/exist.html'))
        .to.throw(/Failed to lookup "\/not\/exist.html" in "\/boo,\/root\/"/)
    })
  })
  describe('#enderToNodeStream', function () {
    const engine = new Liquid()
    it('should render a simple value', async () => {
      const stream = engine.renderToNodeStream(engine.parse('{{"foo"}}'))
      expect(drainStream(stream)).to.eventually.equal('foo')
    })
  })
  describe('#enderFileToNodeStream', function () {
    let engine: Liquid
    before(function () {
      mock({
        '/root/foo.html': 'foo',
        '/root/error.html': 'A{%throwingTag%}B'
      })
      engine = new Liquid({ root: ['/root/'] })
      engine.registerTag('throwingTag', {
        render: function () {
          throw new Error('intended render error')
        }
      })
    })
    after(restore)
    it('should render a simple value', async () => {
      const stream = await engine.renderFileToNodeStream('foo.html')
      expect(drainStream(stream)).to.be.eventually.equal('foo')
    })
    it('should throw RenderError when tag throws', async () => {
      const stream = await engine.renderFileToNodeStream('error.html')
      expect(drainStream(stream)).to.be.rejectedWith(/intended render error/)
    })
  })
})
