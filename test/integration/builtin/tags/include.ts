import Liquid from '../../../../src/liquid'
import { expect } from 'chai'
import { mock, restore } from '../../../stub/mockfs'

describe('tags/include', function () {
  let liquid: Liquid
  before(function () {
    liquid = new Liquid({
      root: '/',
      extname: '.html'
    })
  })
  afterEach(restore)
  it('should support include', async function () {
    mock({
      '/current.html': 'bar{% include "bar/foo.html" %}bar',
      '/bar/foo.html': 'foo'
    })
    const html = await liquid.renderFile('/current.html')
    return expect(html).to.equal('barfoobar')
  })
  it('should support template string', async function () {
    mock({
      '/current.html': 'bar{% include "bar/{{name}}" %}bar',
      '/bar/foo.html': 'foo'
    })
    const html = await liquid.renderFile('/current.html', { name: 'foo.html' })
    return expect(html).to.equal('barfoobar')
  })

  it('should throw when not specified', function () {
    mock({
      '/parent.html': '{%include%}'
    })
    return liquid.renderFile('/parent.html').catch(function (e) {
      expect(e.name).to.equal('RenderError')
      expect(e.message).to.match(/cannot include with empty filename/)
    })
  })

  it('should throw when not exist', function () {
    mock({
      '/parent.html': '{%include not-exist%}'
    })
    return liquid.renderFile('/parent.html').catch(function (e) {
      expect(e.name).to.equal('RenderError')
      expect(e.message).to.match(/cannot include with empty filename/)
    })
  })

  it('should support include with relative path', async function () {
    mock({
      '/bar/foo.html': 'foo',
      '/foo/relative.html': 'bar{% include "../bar/foo.html" %}bar'
    })
    const html = await liquid.renderFile('foo/relative.html')
    return expect(html).to.equal('barfoobar')
  })

  it('should support include: hash list', async function () {
    mock({
      '/hash.html': '{% assign name="harttle" %}{% include "user.html", role: "admin", alias: name %}',
      '/user.html': '{{name}} : {{role}} : {{alias}}'
    })
    const html = await liquid.renderFile('hash.html')
    return expect(html).to.equal('harttle : admin : harttle')
  })

  it('should support include: parent scope', async function () {
    mock({
      '/scope.html': '{% assign shape="triangle" %}{% assign color="yellow" %}{% include "color.html" %}',
      '/color.html': 'color:{{color}}, shape:{{shape}}'
    })
    const html = await liquid.renderFile('scope.html')
    return expect(html).to.equal('color:yellow, shape:triangle')
  })

  it('should support include: with', async function () {
    mock({
      '/with.html': '{% include "color" with "red", shape: "rect" %}',
      '/color.html': 'color:{{color}}, shape:{{shape}}'
    })
    const html = await liquid.renderFile('with.html')
    return expect(html).to.equal('color:red, shape:rect')
  })

  it('should support nested includes', async function () {
    mock({
      '/personInfo.html': 'This is a person {% include "card.html" %}',
      '/card.html': '<p>{{person.firstName}} {{person.lastName}}<br/>{% include "address" %}</p>',
      '/address.html': 'City: {{person.address.city}}'
    })
    const ctx = {
      person: {
        firstName: 'Joe',
        lastName: 'Shmoe',
        address: {
          city: 'Dallas'
        }
      }
    }
    const html = await liquid.renderFile('personInfo.html', ctx)
    return expect(html).to.equal('This is a person <p>Joe Shmoe<br/>City: Dallas</p>')
  })

  describe('static partial', function () {
    it('should support filename with extention', async function () {
      mock({
        '/parent.html': 'X{% include child.html color:"red" %}Y',
        '/child.html': 'child with {{color}}'
      })
      const staticLiquid = new Liquid({ dynamicPartials: false, root: '/' })
      const html = await staticLiquid.renderFile('parent.html')
      return expect(html).to.equal('Xchild with redY')
    })

    it('should support parent paths', async function () {
      mock({
        '/parent.html': 'X{% include bar/./../foo/child.html %}Y',
        '/foo/child.html': 'child'
      })
      const staticLiquid = new Liquid({ dynamicPartials: false, root: '/' })
      const html = await staticLiquid.renderFile('parent.html')
      return expect(html).to.equal('XchildY')
    })

    it('should support subpaths', async function () {
      mock({
        '/parent.html': 'X{% include foo/child.html %}Y',
        '/foo/child.html': 'child'
      })
      const staticLiquid = new Liquid({ dynamicPartials: false, root: '/' })
      const html = await staticLiquid.renderFile('parent.html')
      return expect(html).to.equal('XchildY')
    })

    it('should support comma separated arguments', async function () {
      mock({
        '/parent.html': 'X{% include child.html, color:"red" %}Y',
        '/child.html': 'child with {{color}}'
      })
      const staticLiquid = new Liquid({ dynamicPartials: false, root: '/' })
      const html = await staticLiquid.renderFile('parent.html')
      return expect(html).to.equal('Xchild with redY')
    })
  })
})
