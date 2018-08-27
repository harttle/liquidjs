import Liquid from '../../../src'
import mock from 'mock-fs'
import chai from 'chai'

const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/layout', function () {
  let liquid
  before(function () {
    liquid = Liquid({
      root: '/',
      extname: '.html'
    })
  })
  afterEach(function () {
    mock.restore()
  })

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
    it('should handle anonymous block', function () {
      mock({
        '/parent.html': 'X{%block%}{%endblock%}Y'
      })
      const src = '{% layout "parent.html" %}{%block%}A{%endblock%}'
      return expect(liquid.parseAndRender(src)).to
        .eventually.equal('XAY')
    })
    it('should handle top level contents as anonymous block', function () {
      mock({
        '/parent.html': 'X{%block%}{%endblock%}Y'
      })
      const src = '{% layout "parent.html" %}A'
      return expect(liquid.parseAndRender(src)).to
        .eventually.equal('XAY')
    })
  })
  it('should handle named blocks', function () {
    mock({
      '/parent.html': 'X{% block "a"%}{% endblock %}Y{% block b%}{%endblock%}Z'
    })
    const src = '{% layout "parent.html" %}' +
      '{%block a%}A{%endblock%}' +
      '{%block b%}B{%endblock%}'
    return expect(liquid.parseAndRender(src)).to
      .eventually.equal('XAYBZ')
  })
  it('should support default block content', function () {
    mock({
      '/parent.html': 'X{% block "a"%}A{% endblock %}Y{% block b%}B{%endblock%}Z'
    })
    const src = '{% layout "parent.html" %}{%block a%}a{%endblock%}'
    return expect(liquid.parseAndRender(src)).to
      .eventually.equal('XaYBZ')
  })
  it('should handle nested block', function () {
    mock({
      '/grand.html': 'X{%block a%}G{%endblock%}Y',
      '/parent.html': '{%layout "grand" %}{%block a%}P{%endblock%}',
      '/main.html': '{%layout "parent"%}{%block a%}A{%endblock%}'
    })
    return expect(liquid.renderFile('/main.html')).to
      .eventually.equal('XAY')
  })
  it('should not bleed scope into included layout', function () {
    mock({
      '/parent.html': 'X{%block a%}{%endblock%}Y{%block b%}{%endblock%}Z',
      '/main.html': '{%layout "parent"%}' +
        '{%block a%}A{%endblock%}' +
        '{%block b%}I{%include "included"%}J{%endblock%}',
      '/included.html': '{%layout "parent"%}{%block a%}a{%endblock%}'
    })
    return expect(liquid.renderFile('main')).to
      .eventually.equal('XAYIXaYZJZ')
  })
  it('should support hash list', function () {
    mock({
      '/parent.html': '{{color}}{%block%}{%endblock%}',
      '/main.html': '{% layout "parent.html" color:"black"%}{%block%}A{%endblock%}'
    })
    return expect(liquid.renderFile('/main.html')).to
      .eventually.equal('blackA')
  })
  it('should support multiple hash', function () {
    mock({
      '/parent.html': '{{color}}{{bg}}{%block%}{%endblock%}',
      '/main.html': '{% layout "parent.html" color:"black", bg:"red"%}{%block%}A{%endblock%}'
    })
    return expect(liquid.renderFile('/main.html')).to
      .eventually.equal('blackredA')
  })

  describe('static partial', function () {
    it('should support filename with extention', function () {
      mock({
        '/parent.html': '{{color}}{%block%}{%endblock%}',
        '/main.html': '{% layout parent.html color:"black"%}{%block%}A{%endblock%}'
      })
      const staticLiquid = Liquid({ root: '/', dynamicPartials: false })
      return expect(staticLiquid.renderFile('/main.html')).to
        .eventually.equal('blackA')
    })

    it('should support parent paths', function () {
      mock({
        '/foo/parent.html': '{{color}}{%block%}{%endblock%}',
        '/main.html': '{% layout bar/../foo/parent.html color:"black"%}{%block%}A{%endblock%}'
      })
      const staticLiquid = Liquid({ root: '/', dynamicPartials: false })
      return expect(staticLiquid.renderFile('/main.html')).to
        .eventually.equal('blackA')
    })

    it('should support subpaths', function () {
      mock({
        '/foo/parent.html': '{{color}}{%block%}{%endblock%}',
        '/main.html': '{% layout foo/parent.html color:"black"%}{%block%}A{%endblock%}'
      })
      const staticLiquid = Liquid({ root: '/', dynamicPartials: false })
      return expect(staticLiquid.renderFile('/main.html')).to
        .eventually.equal('blackA')
    })
  })
})
