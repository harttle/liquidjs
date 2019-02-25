import Liquid from '../../../../src/liquid'
import { expect } from 'chai'
import { mock, restore } from '../../../stub/mockfs'

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
      expect(e.name).to.equal('RenderError')
      expect(e.message).to.match(/cannot apply layout with empty filename/)
    })
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
  it('should not bleed scope into included layout', async function () {
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

  describe('static partial', function () {
    it('should support filename with extention', async function () {
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
})
