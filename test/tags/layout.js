const Liquid = require('../..')
const mock = require('mock-fs')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/extends', function () {
  var liquid
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
    var src = '{% extends "parent" %}{%block%}A'
    return expect(liquid.parseAndRender(src)).to
      .be.rejectedWith(/tag {%block%} not closed/)
  })
  it('should handle anonymous block', function () {
    mock({
      '/parent.html': 'X{%block%}{%endblock%}Y'
    })
    var src = '{% extends "parent.html" %}{%block%}A{%endblock%}'
    return expect(liquid.parseAndRender(src)).to
      .eventually.equal('XAY')
  })
  it('should handle named blocks', function () {
    mock({
      '/parent.html': 'X{% block "a"%}{% endblock %}Y{% block b%}{%endblock%}Z'
    })
    var src = '{% extends "parent.html" %}' +
      '{%block a%}A{%endblock%}' +
      '{%block b%}B{%endblock%}'
    return expect(liquid.parseAndRender(src)).to
      .eventually.equal('XAYBZ')
  })
  it('should support default block content', function () {
    mock({
      '/parent.html': 'X{% block "a"%}A{% endblock %}Y{% block b%}B{%endblock%}Z'
    })
    var src = '{% extends "parent.html" %}{%block a%}a{%endblock%}'
    return expect(liquid.parseAndRender(src)).to
      .eventually.equal('XaYBZ')
  })
  it('should handle nested block', function () {
    mock({
      '/grand.html': 'X{%block a%}G{%endblock%}Y',
      '/parent.html': '{%extends "grand" %}{%block a%}P{%endblock%}',
      '/main.html': '{%extends "parent"%}{%block a%}A{%endblock%}'
    })
    return expect(liquid.renderFile('/main.html')).to
      .eventually.equal('XAY')
  })
  it('should not bleed scope into included extends', function () {
    mock({
      '/parent.html': 'X{%block a%}{%endblock%}Y{%block b%}{%endblock%}Z',
      '/main.html': '{%extends "parent"%}' +
        '{%block a%}A{%endblock%}' +
        '{%block b%}I{%include "included"%}J{%endblock%}',
      '/included.html': '{%extends "parent"%}{%block a%}a{%endblock%}'
    })
    return expect(liquid.renderFile('main')).to
      .eventually.equal('XAYIXaYZJZ')
  })
  it('should support hash list', function () {
    mock({
      '/parent.html': '{{color}}{%block%}{%endblock%}',
      '/main.html': '{% extends "parent.html" color:"black"%}{%block%}A{%endblock%}'
    })
    return expect(liquid.renderFile('/main.html')).to
      .eventually.equal('blackA')
  })
  it('should support multiple hash', function () {
    mock({
      '/parent.html': '{{color}}{{bg}}{%block%}{%endblock%}',
      '/main.html': '{% extends "parent.html" color:"black", bg:"red"%}{%block%}A{%endblock%}'
    })
    return expect(liquid.renderFile('/main.html')).to
      .eventually.equal('blackredA')
  })
})
