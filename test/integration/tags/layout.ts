import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { Liquid } from '../../../src/liquid'
import { mock, restore } from '../../stub/mockfs'

use(chaiAsPromised)

describe('tags/layout', function () {
  let liquid: Liquid
  before(function () {
    liquid = new Liquid({
      root: '/',
      extname: '.html'
    })
  })
  afterEach(restore)

  it('should throw when block not closed', function () {
    mock({
      '/parent.html': 'parent'
    })
    const src = '{% layout "parent" %}{%block%}A'
    return expect(liquid.parseAndRender(src)).to
      .be.rejectedWith(/tag {%block%} not closed/)
  })
  it('should throw when filename not specified', function () {
    mock({
      '/parent.html': '{%layout%}'
    })
    return liquid.renderFile('/parent.html').catch(function (e) {
      expect(e.name).to.equal('ParseError')
      expect(e.message).to.match(/illegal argument ""/)
    })
  })
  it('should throw when filename resolved to falsy', function () {
    mock({
      '/parent.html': '{%layout foo%}'
    })
    return liquid.renderFile('/parent.html').catch(function (e) {
      expect(e.name).to.equal('RenderError')
      expect(e.message).to.contain('illegal filename "undefined"')
    })
  })
  it('should handle layout none', async function () {
    const src = '{% layout none %}' +
      '{%block a%}A{%endblock%}' +
      'B'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('AB')
  })
  describe('anonymous block', function () {
    it('should handle anonymous block', async function () {
      mock({
        '/parent.html': 'X{%block%}{%endblock%}Y'
      })
      const src = '{% layout "parent.html" %}{%block%}A{%endblock%}'
      const html = await liquid.parseAndRender(src)
      return expect(html).to.equal('XAY')
    })
    it('should handle top level contents as anonymous block', async function () {
      mock({
        '/parent.html': 'X{%block%}{%endblock%}Y'
      })
      const src = '{% layout "parent.html" %}A'
      const html = await liquid.parseAndRender(src)
      return expect(html).to.equal('XAY')
    })
  })
  it('should handle named blocks', async function () {
    mock({
      '/parent.html': 'X{% block "a"%}{% endblock %}Y{% block b%}{%endblock%}Z'
    })
    const src = '{% layout "parent.html" %}' +
      '{%block a%}A{%endblock%}' +
      '{%block b%}B{%endblock%}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('XAYBZ')
  })
  it('should support `options.layouts`', async () => {
    mock({
      '/layouts/parent.html': 'X{% block "a"%}{%endblock%}Y'
    })
    const src = '{% layout "parent.html" %}{%block a%}A{%endblock%}'
    const liquid = new Liquid({ layouts: '/layouts' })
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('XAY')
  })
  it('should use `layouts` if specified', async function () {
    mock({
      '/layouts/parent.html': 'LAYOUTS {%block%}{%endblock%}',
      '/root/parent.html': 'ROOT {%block%}{%endblock%}',
      '/root/main.html': '{% layout parent.html %}{%block%}A{%endblock%}'
    })
    const staticLiquid = new Liquid({ root: '/root', layouts: '/layouts', dynamicPartials: false })
    const html = await staticLiquid.renderFile('main.html')
    return expect(html).to.equal('LAYOUTS A')
  })

  it('should support block.super', async function () {
    mock({
      '/parent.html': '{% block css %}<link href="base.css" rel="stylesheet">{% endblock %}'
    })
    const src = '{% layout "parent.html" %}' +
      '{%block css%}{{block.super}}<link href="extra.css" rel="stylesheet">{%endblock%}'
    const html = await liquid.parseAndRender(src)
    const output = '<link href="base.css" rel="stylesheet"><link href="extra.css" rel="stylesheet">'
    return expect(html).to.equal(output)
  })
  it('should render block.super to empty if no parent exists', async function () {
    mock({
      '/parent.html': '{% block css %}{{block.super}}<link href="base.css" rel="stylesheet">{% endblock %}'
    })
    const src = '{% layout "parent.html" %}' +
      '{%block css%}{{block.super}}<link href="extra.css" rel="stylesheet">{%endblock%}'
    const html = await liquid.parseAndRender(src)
    const output = '<link href="base.css" rel="stylesheet"><link href="extra.css" rel="stylesheet">'
    return expect(html).to.equal(output)
  })
  it('should support nested block.super', async function () {
    mock({
      '/root.html': '{% block css %}<link href="root.css" rel="stylesheet">{% endblock %}',
      '/parent.html': '{% layout "root.html" %}{% block css %}{{block.super}}<link href="parent.css" rel="stylesheet">{% endblock %}'
    })
    const src = '{% layout "parent.html" %}{%block css%}{{block.super}}<link href="extra.css" rel="stylesheet">{%endblock%}'
    const html = await liquid.parseAndRender(src)
    const output = '<link href="root.css" rel="stylesheet"><link href="parent.css" rel="stylesheet"><link href="extra.css" rel="stylesheet">'
    return expect(html).to.equal(output)
  })
  it('should support variable as layout name', async function () {
    mock({
      '/parent.html': 'X{% block "a"%}{% endblock %}Y'
    })
    const src = '{% layout parent %}{%block a%}A{%endblock%}'
    const html = await liquid.parseAndRender(src, { parent: 'parent.html' })
    return expect(html).to.equal('XAY')
  })
  it('should support default block content', async function () {
    mock({
      '/parent.html': 'X{% block "a"%}A{% endblock %}Y{% block b%}B{%endblock%}Z'
    })
    const src = '{% layout "parent.html" %}{%block a%}a{%endblock%}'
    const html = await liquid.parseAndRender(src)
    return expect(html).to.equal('XaYBZ')
  })
  it('should handle nested block', async function () {
    mock({
      '/grand.html': 'X{%block a%}G{%endblock%}Y',
      '/parent.html': '{%layout "grand" %}{%block a%}P{%endblock%}',
      '/main.html': '{%layout "parent"%}{%block a%}A{%endblock%}'
    })
    const html = await liquid.renderFile('/main.html')
    return expect(html).to.equal('XAY')
  })
  it('should not bleed scope into `include` layout', async function () {
    mock({
      '/parent.html': 'X{%block a%}{%endblock%}Y{%block b%}{%endblock%}Z',
      '/main.html': '{%layout "parent"%}' +
        '{%block a%}A{%endblock%}' +
        '{%block b%}I{%include "included"%}J{%endblock%}',
      '/included.html': '{%layout "parent"%}{%block a%}a{%endblock%}'
    })
    const html = await liquid.renderFile('main')
    return expect(html).to.equal('XAYIXaYZJZ')
  })
  it('should not bleed scope into `render` layout', async function () {
    mock({
      '/parent.html': 'X{%block a%}{%endblock%}Y{%block b%}{%endblock%}Z',
      '/main.html': '{%layout "parent"%}' +
        '{%block a%}A{%endblock%}' +
        '{%block b%}I{%render "included"%}J{%endblock%}',
      '/included.html': '{%layout "parent"%}{%block a%}a{%endblock%}'
    })
    const html = await liquid.renderFile('main')
    return expect(html).to.equal('XAYIXaYZJZ')
  })
  it('should support hash list', async function () {
    mock({
      '/parent.html': '{{color}}{%block%}{%endblock%}',
      '/main.html': '{% layout "parent.html" color:"black"%}{%block%}A{%endblock%}'
    })
    const html = await liquid.renderFile('/main.html')
    return expect(html).to.equal('blackA')
  })
  it('should support multiple hash', async function () {
    mock({
      '/parent.html': '{{color}}{{bg}}{%block%}{%endblock%}',
      '/main.html': '{% layout "parent.html" color:"black", bg:"red"%}{%block%}A{%endblock%}'
    })
    const html = await liquid.renderFile('/main.html')
    return expect(html).to.equal('blackredA')
  })

  it('should support relative reference', async function () {
    mock({
      '/foo/bar/parent.html': '{{color}}{%block%}{%endblock%}',
      '/foo/bar/main.html': '{% layout ./parent.html color:"black"%}{%block%}A{%endblock%}'
    })
    const staticLiquid = new Liquid({ root: '/', dynamicPartials: false })
    const html = await staticLiquid.renderFile('/foo/bar/main.html')
    return expect(html).to.equal('blackA')
  })

  it('should support relative root', async function () {
    mock({
      [process.cwd() + '/foo/parent.html']: '{{color}}{%block%}{%endblock%}',
      [process.cwd() + '/foo/bar/main.html']: '{% layout parent.html color:"black"%}{%block%}A{%endblock%}'
    })
    const staticLiquid = new Liquid({ root: './foo', dynamicPartials: false })
    const html = await staticLiquid.renderFile('bar/main.html')
    return expect(html).to.equal('blackA')
  })

  describe('static partial', function () {
    it('should support filename with extension', async function () {
      mock({
        '/parent.html': '{{color}}{%block%}{%endblock%}',
        '/main.html': '{% layout parent.html color:"black"%}{%block%}A{%endblock%}'
      })
      const staticLiquid = new Liquid({ root: '/', dynamicPartials: false })
      const html = await staticLiquid.renderFile('/main.html')
      return expect(html).to.equal('blackA')
    })

    it('should support parent paths', async function () {
      mock({
        '/foo/parent.html': '{{color}}{%block%}{%endblock%}',
        '/main.html': '{% layout bar/../foo/parent.html color:"black"%}{%block%}A{%endblock%}'
      })
      const staticLiquid = new Liquid({ root: '/', dynamicPartials: false })
      const html = await staticLiquid.renderFile('/main.html')
      return expect(html).to.equal('blackA')
    })

    it('should support none', async function () {
      mock({
        '/main.html': '{% layout none %}foo'
      })
      const staticLiquid = new Liquid({ root: '/', dynamicPartials: false })
      const html = await staticLiquid.renderFile('/main.html')
      return expect(html).to.equal('foo')
    })

    it('should support subpaths', async function () {
      mock({
        '/foo/parent.html': '{{color}}{%block%}{%endblock%}',
        '/main.html': '{% layout foo/parent.html color:"black"%}{%block%}A{%endblock%}'
      })
      const staticLiquid = new Liquid({ root: '/', dynamicPartials: false })
      const html = await staticLiquid.renderFile('/main.html')
      return expect(html).to.equal('blackA')
    })
  })
  it('should support sync', function () {
    mock({
      '/grand.html': 'X{%block a%}G{%endblock%}Y',
      '/parent.html': '{%layout "grand" %}{%block a%}P{%endblock%}',
      '/main.html': '{%layout "parent"%}{%block a%}A{%endblock%}'
    })
    const html = liquid.renderFileSync('/main.html')
    return expect(html).to.equal('XAY')
  })
})
