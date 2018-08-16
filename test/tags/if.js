const Liquid = require('../..')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/if', function () {
  let liquid = Liquid()
  let ctx = {
    one: 1,
    two: 2,
    emptyString: '',
    emptyArray: []
  }

  it('should throw if not closed', function () {
    let src = '{% if false%}yes'
    return expect(liquid.parseAndRender(src, ctx))
      .to.be.rejectedWith(/tag {% if false%} not closed/)
  })
  it('should support nested', function () {
    let src = '{%if false%}{%if true%}{%else%}a{%endif%}{%endif%}'
    return expect(liquid.parseAndRender(src, ctx))
      .to.eventually.equal('')
  })

  describe('single value as condition', function () {
    it('should support boolean', function () {
      let src = '{% if false %}1{%elsif true%}2{%else%}3{%endif%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('2')
    })
    it('should treat Array truthy', function () {
      let src = '{%if emptyArray%}a{%endif%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('a')
    })
    it('should return true if empty string', function () {
      let src = '{%if emptyString%}a{%endif%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('a')
    })
  })
  describe('expression as condition', function () {
    it('should support ==', function () {
      let src = '{% if 2==3 %}yes{%else%}no{%endif%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('no')
    })
    it('should support >=', function () {
      let src = '{% if 1>=2 and one<two %}a{%endif%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('')
    })
    it('should support !=', function () {
      let src = '{% if one!=two %}yes{%else%}no{%endif%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('yes')
    })
    it('should support value and expression', function () {
      let src = `X{%if version and version != '' %}x{{version}}y{%endif%}Y`
      let ctx = { 'version': '' }
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('XY')
    })
  })
  describe('comparasion to null', function () {
    it('should evaluate false for null < 10', function () {
      let src = '{% if null < 10 %}yes{% else %}no{% endif %}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('no')
    })

    it('should evaluate false for null > 10', function () {
      let src = '{% if null > 10 %}yes{% else %}no{% endif %}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('no')
    })

    it('should evaluate false for null <= 10', function () {
      let src = '{% if null <= 10 %}yes{% else %}no{% endif %}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('no')
    })

    it('should evaluate false for null >= 10', function () {
      let src = '{% if null >= 10 %}yes{% else %}no{% endif %}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('no')
    })

    it('should evaluate false for 10 < null', function () {
      let src = '{% if 10 < null %}yes{% else %}no{% endif %}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('no')
    })

    it('should evaluate false for 10 > null', function () {
      let src = '{% if 10 > null %}yes{% else %}no{% endif %}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('no')
    })

    it('should evaluate false for 10 <= null', function () {
      let src = '{% if 10 <= null %}yes{% else %}no{% endif %}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('no')
    })

    it('should evaluate false for 10 >= null', function () {
      let src = '{% if 10 >= null %}yes{% else %}no{% endif %}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('no')
    })
  })
})
