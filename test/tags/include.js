const Liquid = require('../..')
const mock = require('mock-fs')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/include', function () {
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
  it('should support include', function () {
    mock({
      '/current.html': 'bar{% include "bar/foo.html" %}bar',
      '/bar/foo.html': 'foo'
    })
    return expect(liquid.renderFile('/current.html')).to
      .eventually.equal('barfoobar')
  })

  it('should throw when illegal', function () {
    mock({
      '/illegal.html': '{%include%}'
    })
    return liquid.renderFile('/illegal.html').catch(function (e) {
      expect(e.name).to.equal('ParseError')
      expect(e.message).to.match(/illegal token {%include%}/)
    })
  })

  it('should support include with relative path', function () {
    mock({
      '/bar/foo.html': 'foo',
      '/foo/relative.html': 'bar{% include "../bar/foo.html" %}bar'
    })
    return expect(liquid.renderFile('foo/relative.html')).to
      .eventually.equal('barfoobar')
  })

  it('should support include: hash list', function () {
    mock({
      '/hash.html': '{% assign name="harttle" %}{% include "user.html", role: "admin", alias: name %}',
      '/user.html': '{{name}} : {{role}} : {{alias}}'
    })
    return expect(liquid.renderFile('hash.html')).to
      .eventually.equal('harttle : admin : harttle')
  })

  it('should support include: parent scope', function () {
    mock({
      '/scope.html': '{% assign shape="triangle" %}{% assign color="yellow" %}{% include "color.html" %}',
      '/color.html': 'color:{{color}}, shape:{{shape}}'
    })
    return expect(liquid.renderFile('scope.html')).to
      .eventually.equal('color:yellow, shape:triangle')
  })

  it('should support include: with', function () {
    mock({
      '/with.html': '{% include "color" with "red", shape: "rect" %}',
      '/color.html': 'color:{{color}}, shape:{{shape}}'
    })
    return expect(liquid.renderFile('with.html')).to
      .eventually.equal('color:red, shape:rect')
  })

  it('should support nested includes', function () {
    mock({
      '/personInfo.html': 'This is a person {% include "card.html" %}',
      '/card.html': '<p>{{person.firstName}} {{person.lastName}}<br/>{% include "address" %}</p>',
      '/address.html': 'City: {{person.address.city}}'
    })
    var ctx = {
      person: {
        firstName: 'Joe',
        lastName: 'Shmoe',
        address: {
          city: 'Dallas'
        }
      }
    }
    return expect(liquid.renderFile('personInfo.html', ctx)).to
      .eventually.equal('This is a person <p>Joe Shmoe<br/>City: Dallas</p>')
  })
})
