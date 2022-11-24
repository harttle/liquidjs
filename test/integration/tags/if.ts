import { Liquid } from '../../../src/liquid'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

const expect = chai.expect
chai.use(chaiAsPromised)

describe('tags/if', function () {
  const liquid = new Liquid()
  const scope = {
    one: 1,
    two: 2,
    emptyString: '',
    emptyArray: []
  }

  it('should throw if not closed', function () {
    const src = '{% if false%}yes'
    return expect(liquid.parseAndRender(src, scope))
      .to.be.rejectedWith(/tag {% if false%} not closed/)
  })
  it('should support nested', async function () {
    const src = '{%if false%}{%if true%}{%else%}a{%endif%}{%endif%}'
    const html = await liquid.parseAndRender(src, scope)
    return expect(html).to.equal('')
  })

  describe('single value as condition', function () {
    it('should support boolean', async function () {
      const src = '{% if false %}1{%elsif true%}2{%else%}3{%endif%}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('2')
    })
    it('should treat Array truthy', async function () {
      const src = '{%if emptyArray%}a{%endif%}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('a')
    })
    it('should return true if empty string', async function () {
      const src = '{%if emptyString%}a{%endif%}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('a')
    })
  })
  describe('expression as condition', function () {
    it('should support ==', async function () {
      const src = '{% if 2 == 3 %}yes{%else%}no{%endif%}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('no')
    })
    it('should support >=', async function () {
      const src = '{% if 1 >= 2 and one<two %}a{%endif%}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('')
    })
    it('should support !=', async function () {
      const src = '{% if one != two %}yes{%else%}no{%endif%}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('yes')
    })
    it('should support value and expression', async function () {
      const src = `X{%if version and version != '' %}x{{version}}y{%endif%}Y`
      const scope = { 'version': '' }
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('XY')
    })
    it('should evaluate right to left', async function () {
      const src = `{% if false and false or true %}true{%endif%}`
      const html = await liquid.parseAndRender(src)
      return expect(html).to.equal('')
    })
    it('should allow no spaces around operator for literal', async function () {
      const src = `{% if true==true %}success{%else%}fail{% endif %}`
      const html = await liquid.parseAndRender(src)
      return expect(html).to.equal('success')
    })
    it('should allow no spaces around operator for variables', async function () {
      const src = `{%assign var = 1%}{%if var ==1%}success{%else%}fail{%endif%}`
      const html = await liquid.parseAndRender(src)
      return expect(html).to.equal('success')
    })
  })
  describe('filters as condition', function () {
    it('should support filter on expression', async function () {
      liquid.registerFilter('negate', (val) => !val)
      const src = '{% if 2 == 3 | negate %}yes{%else%}no{%endif%}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('yes')
    })
  })
  describe('compare to null', function () {
    it('should evaluate false for null < 10', async function () {
      const src = '{% if null < 10 %}yes{% else %}no{% endif %}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('no')
    })

    it('should evaluate false for null > 10', async function () {
      const src = '{% if null > 10 %}yes{% else %}no{% endif %}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('no')
    })

    it('should evaluate false for null <= 10', async function () {
      const src = '{% if null <= 10 %}yes{% else %}no{% endif %}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('no')
    })

    it('should evaluate false for null >= 10', async function () {
      const src = '{% if null >= 10 %}yes{% else %}no{% endif %}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('no')
    })

    it('should evaluate false for 10 < null', async function () {
      const src = '{% if 10 < null %}yes{% else %}no{% endif %}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('no')
    })

    it('should evaluate false for 10 > null', async function () {
      const src = '{% if 10 > null %}yes{% else %}no{% endif %}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('no')
    })

    it('should evaluate false for 10 <= null', async function () {
      const src = '{% if 10 <= null %}yes{% else %}no{% endif %}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('no')
    })

    it('should evaluate false for 10 >= null', async function () {
      const src = '{% if 10 >= null %}yes{% else %}no{% endif %}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('no')
    })
  })
  it('should support sync', function () {
    const src = '{%if true%}true{%else%}false{%endif%}'
    const html = liquid.parseAndRenderSync(src, scope)
    return expect(html).to.equal('true')
  })
  it('should support async variables', async () => {
    const src = `{%if var == 'var' %}success{%endif%}`
    const scope = { 'var': Promise.resolve('var') }
    const html = await liquid.parseAndRender(src, scope)
    return expect(html).to.equal('success')
  })
})
