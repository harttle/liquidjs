import Liquid from '../../../../src/liquid'
import { expect } from 'chai'

describe('tags/if', function () {
  const liquid = new Liquid()
  const ctx = {
    one: 1,
    two: 2,
    emptyString: '',
    emptyArray: []
  }

  it('should throw if not closed', function () {
    const src = '{% if false%}yes'
    return expect(liquid.parseAndRender(src, ctx))
      .to.be.rejectedWith(/tag {% if false%} not closed/)
  })
  it('should support nested', async function () {
    const src = '{%if false%}{%if true%}{%else%}a{%endif%}{%endif%}'
    const html = await liquid.parseAndRender(src, ctx)
    return expect(html).to.equal('')
  })

  describe('single value as condition', function () {
    it('should support boolean', async function () {
      const src = '{% if false %}1{%elsif true%}2{%else%}3{%endif%}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('2')
    })
    it('should treat Array truthy', async function () {
      const src = '{%if emptyArray%}a{%endif%}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('a')
    })
    it('should return true if empty string', async function () {
      const src = '{%if emptyString%}a{%endif%}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('a')
    })
  })
  describe('expression as condition', function () {
    it('should support ==', async function () {
      const src = '{% if 2==3 %}yes{%else%}no{%endif%}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('no')
    })
    it('should support >=', async function () {
      const src = '{% if 1>=2 and one<two %}a{%endif%}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('')
    })
    it('should support !=', async function () {
      const src = '{% if one!=two %}yes{%else%}no{%endif%}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('yes')
    })
    it('should support value and expression', async function () {
      const src = `X{%if version and version != '' %}x{{version}}y{%endif%}Y`
      const ctx = { 'version': '' }
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('XY')
    })
  })
  describe('comparasion to null', function () {
    it('should evaluate false for null < 10', async function () {
      const src = '{% if null < 10 %}yes{% else %}no{% endif %}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('no')
    })

    it('should evaluate false for null > 10', async function () {
      const src = '{% if null > 10 %}yes{% else %}no{% endif %}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('no')
    })

    it('should evaluate false for null <= 10', async function () {
      const src = '{% if null <= 10 %}yes{% else %}no{% endif %}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('no')
    })

    it('should evaluate false for null >= 10', async function () {
      const src = '{% if null >= 10 %}yes{% else %}no{% endif %}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('no')
    })

    it('should evaluate false for 10 < null', async function () {
      const src = '{% if 10 < null %}yes{% else %}no{% endif %}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('no')
    })

    it('should evaluate false for 10 > null', async function () {
      const src = '{% if 10 > null %}yes{% else %}no{% endif %}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('no')
    })

    it('should evaluate false for 10 <= null', async function () {
      const src = '{% if 10 <= null %}yes{% else %}no{% endif %}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('no')
    })

    it('should evaluate false for 10 >= null', async function () {
      const src = '{% if 10 >= null %}yes{% else %}no{% endif %}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('no')
    })
  })
})
