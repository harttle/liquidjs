import { Liquid, Context, isFalsy } from '../../../src'
import { mock, restore } from '../../stub/mockfs'
import { drainStream } from '../../stub/stream'

describe('Liquid', function () {
  describe('#plugin()', function () {
    it('should call plugin on the instance', async function () {
      const engine = new Liquid()
      engine.plugin(function () {
        this.registerFilter('foo', x => `foo${x}foo`)
      })
      const html = await engine.parseAndRender('{{"bar"|foo}}')
      expect(html).toBe('foobarfoo')
    })
    it('should call plugin with Liquid', async function () {
      const engine = new Liquid()
      engine.plugin(function () {
        this.registerFilter('t', function (v) { return isFalsy(v, this.context) })
      })
      const html = await engine.parseAndRender('{{false|t}}')
      expect(html).toBe('true')
    })
  })
  describe('#parseAndRender', function () {
    const engine = new Liquid()
    it('should parse and render variable output', async function () {
      const html = await engine.parseAndRender('{{"foo"}}')
      expect(html).toBe('foo')
    })
    it('should parse and render complex output', async function () {
      const tpl = '{{ "Welcome|to]Liquid" | split: "|" | join: "("}}'
      const html = await engine.parseAndRender(tpl)
      expect(html).toBe('Welcome(to]Liquid')
    })
    it('should support for-in with variable', async function () {
      const src = '{% assign total = 3 | minus: 1 %}' +
        '{% for i in (1..total) %}{{ i }}{% endfor %}'
      const html = await engine.parseAndRender(src, {})
      return expect(html).toBe('12')
    })
    it('should support `globals` render option', async function () {
      const src = '{{ foo }}'
      const html = await engine.parseAndRender(src, {}, { globals: { foo: 'FOO' } })
      return expect(html).toBe('FOO')
    })
    it('should support `strictVariables` render option', function () {
      const src = '{{ foo }}'
      return expect(engine.parseAndRender(src, {}, { strictVariables: true })).rejects.toThrow(/undefined variable/)
    })
    it('should support async variables in output', async () => {
      const src = '{{ foo }}'
      const html = await engine.parseAndRender(src, { foo: Promise.resolve('FOO') })
      expect(html).toBe('FOO')
    })
    it('should parse and render with Context', async function () {
      const html = await engine.parseAndRender('{{foo}}', new Context({ foo: 'FOO' }))
      expect(html).toBe('FOO')
    })
  })
  describe('#parseAndRenderSync', function () {
    const engine = new Liquid()
    it('should parse and render variable output', function () {
      const html = engine.parseAndRenderSync('{{"foo"}}')
      expect(html).toBe('foo')
    })
    it('should parse and render complex output', function () {
      const tpl = '{{ "Welcome|to]Liquid" | split: "|" | join: "("}}'
      const html = engine.parseAndRenderSync(tpl)
      expect(html).toBe('Welcome(to]Liquid')
    })
    it('should support for-in with variable', function () {
      const src = '{% assign total = 3 | minus: 1 %}' +
        '{% for i in (1..total) %}{{ i }}{% endfor %}'
      const html = engine.parseAndRenderSync(src, {})
      return expect(html).toBe('12')
    })
    it('should support `globals` render option', function () {
      const src = '{{ foo }}'
      const html = engine.parseAndRenderSync(src, {}, { globals: { foo: 'FOO' } })
      return expect(html).toBe('FOO')
    })
    it('should support `strictVariables` render option', function () {
      const src = '{{ foo }}'
      return expect(() => engine.parseAndRenderSync(src, {}, { strictVariables: true })).toThrow(/undefined variable/)
    })
  })
  describe('#express()', function () {
    const liquid = new Liquid({ root: '/root' })
    const render = liquid.express()
    beforeEach(function () {
      mock({
        '/root/foo': 'foo'
      })
    })
    afterEach(restore)
    it('should render single template', function (done) {
      render.call({ root: '/root' }, 'foo', null as any, (err: Error | null, result: string | undefined) => {
        if (err) return done(err)
        expect(result).toBe('foo')
        done()
      })
    })
    it('should render single template with Array-typed root', function (done) {
      render.call({ root: ['/root'] }, 'foo', null as any, (err: Error | null, result: string | undefined) => {
        if (err) return done(err)
        expect(result).toBe('foo')
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
      return expect(engine.renderFile('/not/exist.html')).rejects.toThrow(/Failed to lookup "\/not\/exist.html" in "\/boo,\/root\/"/)
    })
  })
  describe('#parseFile', function () {
    it('should throw with lookup list when file not exist', function () {
      const engine = new Liquid({
        root: ['/boo', '/root/'],
        extname: '.html'
      })
      return expect(engine.parseFile('/not/exist.html')).rejects.toThrow(/Failed to lookup "\/not\/exist.html" in "\/boo,\/root\/"/)
    })
    it('should fallback to require.resolve in Node.js', async function () {
      const engine = new Liquid({
        root: ['/root/'],
        extname: '.html'
      })
      const tpls = await engine.parseFileSync('jest')
      expect(tpls.length).toBeGreaterThanOrEqual(1)
      expect(tpls[0].token.getText()).toContain('use strict')
    })
  })
  describe('#evalValue', function () {
    it('should eval string literal', async function () {
      const engine = new Liquid()
      const ctx = new Context()
      const str = await engine.evalValue('"foo"', ctx)
      expect(str).toBe('foo')
    })
    it('should support plain scope', async function () {
      const engine = new Liquid()
      const str = await engine.evalValue('foo', { foo: 'FOO' })
      expect(str).toBe('FOO')
    })
  })
  describe('#evalValueSync', function () {
    it('should eval string literal', function () {
      const engine = new Liquid()
      const ctx = new Context()
      const str = engine.evalValueSync('"foo"', ctx)
      expect(str).toBe('foo')
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
      return expect(engine.renderSync(tpls)).toBe('foo')
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
      return expect(engine.renderSync(tpls)).toBe('foo')
    })
  })
  describe('#parseFileSync', function () {
    it('should throw with lookup list when file not exist', function () {
      const engine = new Liquid({
        root: ['/boo', '/root/'],
        extname: '.html'
      })
      return expect(() => engine.parseFileSync('/not/exist.html'))
        .toThrow(/Failed to lookup "\/not\/exist.html" in "\/boo,\/root\/"/)
    })
    it('should throw with lookup list when file not exist', function () {
      const engine = new Liquid({
        root: ['/boo', '/root/'],
        extname: '.html'
      })
      return expect(() => engine.parseFileSync('/not/exist.html'))
        .toThrow(/Failed to lookup "\/not\/exist.html" in "\/boo,\/root\/"/)
    })
  })
  describe('#enderToNodeStream', function () {
    const engine = new Liquid()
    it('should render a simple value', async () => {
      const stream = engine.renderToNodeStream(engine.parse('{{"foo"}}'))
      expect(drainStream(stream)).resolves.toBe('foo')
    })
  })
  describe('#enderFileToNodeStream', function () {
    let engine: Liquid
    beforeEach(function () {
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
    afterEach(restore)
    it('should render a simple value', async () => {
      const stream = await engine.renderFileToNodeStream('foo.html')
      expect(drainStream(stream)).resolves.toBe('foo')
    })
    it('should throw RenderError when tag throws', async () => {
      const stream = await engine.renderFileToNodeStream('error.html')
      expect(drainStream(stream)).rejects.toThrow(/intended render error/)
    })
  })
  describe('#analyze', () => {
    const engine = new Liquid()
    it('should analyze templates asynchronously', () => {
      const template = engine.parse('{{ a }}{{ b }}')
      expect(engine.analyze(template).then((a) => Object.keys(a.variables))).resolves.toStrictEqual(['a', 'b'])
    })
  })
  describe('#analyzeSync', () => {
    const engine = new Liquid()
    it('should analyze templates synchronously', () => {
      const template = engine.parse('{{ a }}{{ b }}')
      expect(Object.keys(engine.analyzeSync(template).variables)).toStrictEqual(['a', 'b'])
    })
  })
  describe('#parseAndAnalyze', () => {
    const engine = new Liquid()
    it('should parse and analyze templates asynchronously', () => {
      expect(engine.parseAndAnalyze('{{ a }}{{ b }}').then((a) => Object.keys(a.variables))).resolves.toStrictEqual(['a', 'b'])
    })
  })
  describe('#parseAndAnalyzeSync', () => {
    const engine = new Liquid()
    it('should analyze templates synchronously', () => {
      expect(Object.keys(engine.parseAndAnalyzeSync('{{ a }}{{ b }}').variables)).toStrictEqual(['a', 'b'])
    })
  })
  describe('Convenience analysis', () => {
    const engine = new Liquid()

    it('should list all variables without their properties', () => {
      expect(engine.variables('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}')).resolves.toStrictEqual(['a', 'c'])
      expect(engine.variables(engine.parse('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}'))).resolves.toStrictEqual(['a', 'c'])
    })

    it('should list all variables without their properties synchronously', () => {
      expect(engine.variablesSync('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}')).toStrictEqual(['a', 'c'])
      expect(engine.variablesSync(engine.parse('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}'))).toStrictEqual(['a', 'c'])
    })

    it('should list global variables without their properties', () => {
      expect(engine.globalVariables('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}')).resolves.toStrictEqual(['a'])
      expect(engine.globalVariables(engine.parse('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}'))).resolves.toStrictEqual(['a'])
    })

    it('should list global variables without their properties synchronously', () => {
      expect(engine.globalVariablesSync('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}')).toStrictEqual(['a'])
      expect(engine.globalVariablesSync(engine.parse('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}'))).toStrictEqual(['a'])
    })

    it('should list all variables with their properties', () => {
      expect(engine.fullVariables('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}')).resolves.toStrictEqual(['a.b', 'c'])
      expect(engine.fullVariables(engine.parse('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}'))).resolves.toStrictEqual(['a.b', 'c'])
    })

    it('should list all variables with their properties synchronously', () => {
      expect(engine.fullVariablesSync('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}')).toStrictEqual(['a.b', 'c'])
      expect(engine.fullVariablesSync(engine.parse('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}'))).toStrictEqual(['a.b', 'c'])
    })

    it('should list global variables with their properties', () => {
      expect(engine.globalFullVariables('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}')).resolves.toStrictEqual(['a.b'])
      expect(engine.globalFullVariables(engine.parse('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}'))).resolves.toStrictEqual(['a.b'])
    })

    it('should list global variables with their properties synchronously', () => {
      expect(engine.globalFullVariablesSync('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}')).toStrictEqual(['a.b'])
      expect(engine.globalFullVariablesSync(engine.parse('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}'))).toStrictEqual(['a.b'])
    })

    it('should list all variables as an array of segments', () => {
      expect(engine.variableSegments('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}')).resolves.toStrictEqual([['a', 'b'], ['c']])
      expect(engine.variableSegments(engine.parse('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}'))).resolves.toStrictEqual([['a', 'b'], ['c']])
    })

    it('should list all variables as an array of segments synchronously', () => {
      expect(engine.variableSegmentsSync('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}')).toStrictEqual([['a', 'b'], ['c']])
      expect(engine.variableSegmentsSync(engine.parse('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}'))).toStrictEqual([['a', 'b'], ['c']])
    })

    it('should list global variables as an array of segments', () => {
      expect(engine.globalVariableSegments('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}')).resolves.toStrictEqual([['a', 'b']])
      expect(engine.globalVariableSegments(engine.parse('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}'))).resolves.toStrictEqual([['a', 'b']])
    })

    it('should list global variables as an array of segments synchronously', () => {
      expect(engine.globalVariableSegmentsSync('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}')).toStrictEqual([['a', 'b']])
      expect(engine.globalVariableSegmentsSync(engine.parse('{% assign c = 1 %}{{ a.b }}{{ c }}{{ c }}'))).toStrictEqual([['a', 'b']])
    })
  })
})
