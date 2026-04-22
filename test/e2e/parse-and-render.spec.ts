import { Liquid } from '../..'
import { mkdtempSync, writeFileSync, symlinkSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

describe('.parseAndRender()', function () {
  var engine: Liquid, strictEngine: Liquid
  beforeEach(function () {
    engine = new Liquid()
    strictEngine = new Liquid({
      strictFilters: true
    })
  })
  it('should stringify array ', async function () {
    var ctx = { arr: [-2, 'a'] }
    const html = await engine.parseAndRender('{{arr}}', ctx)
    return expect(html).toBe('-2a')
  })
  it('should render undefined as empty', async function () {
    const html = await engine.parseAndRender('foo{{zzz}}bar', {})
    return expect(html).toBe('foobar')
  })
  it('should render as null when filter undefined', async function () {
    const html = await engine.parseAndRender('{{"foo" | filter1}}', {})
    return expect(html).toBe('foo')
  })
  it('should throw upon undefined filter when strictFilters set', function () {
    return expect(strictEngine.parseAndRender('{{"foo" | filter1}}', {})).rejects.toThrow(/undefined filter: filter1/)
  })
  it('should parse html', function () {
    expect(function () {
      engine.parse('{{obj}}')
    }).not.toThrow()
    expect(function () {
      engine.parse('<html><head>{{obj}}</head></html>')
    }).not.toThrow()
  })
  it('template should be able to be rendered multiple times', async function () {
    const ctx = { obj: [1, 2] }
    const template = engine.parse('{{obj}}')
    const result = await engine.render(template, ctx)
    expect(result).toBe('12')
    const result2 = await engine.render(template, ctx)
    expect(result2).toBe('12')
  })
  it('should support the "join" filter', async function () {
    var ctx = { names: ['alice', 'bob'] }
    var template = engine.parse('<p>{{names | join: ","}}</p>')
    const html = await engine.render(template, ctx)
    return expect(html).toBe('<p>alice,bob</p>')
  })
  it('should support the "first" filter', async function () {
    var src = '{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}' +
      '{{ my_array | first }}'
    const html = await engine.parseAndRender(src)
    return expect(html).toBe('apples')
  })
  it('should support nil(null, undefined) literal', async function () {
    const src = '{% if nonexistent == nil %}true{% endif %}'
    const html = await engine.parseAndRender(src)
    expect(html).toBe('true')
  })
  const canSymlink = process.platform !== 'win32'
  ;(canSymlink ? describe : describe.skip)('symlink outside root', function () {
    let root: string, secret: string
    beforeAll(function () {
      root = mkdtempSync(join(tmpdir(), 'liquid-e2e-root-'))
      secret = join(tmpdir(), `liquid-e2e-secret-${Date.now()}.liquid`)
      writeFileSync(secret, 'SECRET_OUTSIDE')
      symlinkSync(secret, join(root, 'link.liquid'))
    })
    afterAll(function () {
      rmSync(root, { recursive: true, force: true })
      rmSync(secret, { force: true })
    })
    it('should not render a symlink partial whose target is outside root', async function () {
      const e = new Liquid({ root: [root], extname: '.liquid', relativeReference: false })
      await expect(e.parseAndRender('{% render "link" %}')).rejects.toThrow(/ENOENT|Failed to lookup/)
    })
    it('should not render a symlink partial via parseAndRenderSync', function () {
      const e = new Liquid({ root: [root], extname: '.liquid', relativeReference: false })
      expect(() => e.parseAndRenderSync('{% render "link" %}')).toThrow(/ENOENT|Failed to lookup/)
    })
  })
  describe('layout: nested {% block %} regression', function () {
    let root: string
    beforeEach(function () {
      root = mkdtempSync(join(tmpdir(), 'liquid-e2e-layout-nested-'))
    })
    afterEach(function () {
      rmSync(root, { recursive: true, force: true })
    })
    it('should reject same-name {% block %} nested in child template (no hang / OOM)', async function () {
      writeFileSync(
        join(root, 'layout.html'),
        '<header>{% block a %}default-a{% endblock %}</header>' +
        '<main>{% block b %}default-b{% endblock %}</main>' +
        '<footer>{% block c %}default-c{% endblock %}</footer>'
      )
      writeFileSync(
        join(root, 'template.html'),
        '{% layout "layout" %}' +
        '{% block a %}outer-a {% block a %}inner-a{% endblock %}{% endblock %}' +
        '{% block b %}content-b{% endblock %}' +
        '{% block c %}content-c{% endblock %}'
      )
      const liquid = new Liquid({ root, extname: '.html' })
      await expect(liquid.renderFile('template')).rejects.toThrow(/block tag cannot be nested/)
    })
    it('should reject nested anonymous {% block %} in child template (no hang / OOM)', async function () {
      writeFileSync(join(root, 'parent.html'), 'X{%block%}{%endblock%}Y')
      writeFileSync(
        join(root, 'template.html'),
        '{% layout "parent" %}{%block%}A{%block%}B{%endblock%}{%endblock%}'
      )
      const liquid = new Liquid({ root, extname: '.html' })
      await expect(liquid.renderFile('template')).rejects.toThrow(/block tag cannot be nested/)
    })
  })
})
