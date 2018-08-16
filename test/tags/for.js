import Liquid from '../../src'
import chai from 'chai'

const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/for', function () {
  let liquid, ctx
  before(function () {
    liquid = Liquid()
    liquid.registerTag('throwingTag', {
      render: function () { throw new Error('intended render error') }
    })
    ctx = {
      one: 1,
      // eslint-disable-next-line
      strObj: new String(''),
      emptyObj: {},
      nullProtoObj: Object.create(null),
      obj: {foo: 'bar', coo: 'haa'},
      alpha: ['a', 'b', 'c'],
      emptyArray: []
    }
  })
  it('should support array', function () {
    let src = '{%for c in alpha%}{{c}}{%endfor%}'
    return expect(liquid.parseAndRender(src, ctx))
      .to.eventually.equal('abc')
  })

  it('should support object', function () {
    let src = '{%for item in obj%}{{item[0]}},{{item[1]}}-{%else%}b{%endfor%}'
    return expect(liquid.parseAndRender(src, ctx))
      .to.eventually.equal('foo,bar-coo,haa-')
  })

  describe('scope', function () {
    it('should read super scope', function () {
      let src = '{%for a in (1..2)%}{{num}}{%endfor%}'
      return expect(liquid.parseAndRender(src, {num: 1}))
        .to.eventually.equal('11')
    })
    it('should write super scope', function () {
      let src = '{%for a in (1..2)%}{{num}}{%assign num = 2%}{%endfor%}'
      return expect(liquid.parseAndRender(src, {num: 1}))
        .to.eventually.equal('12')
    })
  })

  describe('illegal', function () {
    it('should reject when for not closed', function () {
      let src = '{%for c in alpha%}{{c}}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.be.rejectedWith(/tag .* not closed/)
    })

    it('should reject when inner templates rejected', function () {
      let src = '{%for c in alpha%}{%throwingTag%}{%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.be.rejectedWith(/intended render error/)
    })
  })

  describe('else', function () {
    it('should goto else for empty array', function () {
      let src = '{%for c in emptyArray%}a{%else%}b{%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('b')
    })

    it('should treat non-empty string as one single element', function () {
      let src = '{%for c in "abc"%}x{{c}}{%else%}y{%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('xabc')
    })

    it('should goto else for empty string', function () {
      let src = '{%for c in ""%}a{%else%}b{%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('b')
    })

    it('should goto else for empty string object', function () {
      // it should be false although `new String` is none-conform
      let src = '{%for c in strObj%}a{%else%}b{%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('b')
    })

    it('should goto else for empty object', function () {
      let src = '{%for c in emptyObj%}a{%else%}b{%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('b')
    })

    it('should goto else for null-prototyped object', function () {
      let src = '{%for c in nullProtoObj%}a{%else%}b{%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('b')
    })
  })

  it('should support for with forloop', function () {
    let src = '{%for c in alpha%}' +
            '{{forloop.first}}.{{forloop.index}}.{{forloop.index0}}.' +
            '{{forloop.last}}.{{forloop.length}}.' +
            '{{forloop.rindex}}.{{forloop.rindex0}}' +
            '{{c}}\n' +
            '{%endfor%}'
    let dst = 'true.1.0.false.3.3.2a\n' +
            'false.2.1.false.3.2.1b\n' +
            'false.3.2.true.3.1.0c\n'
    return expect(liquid.parseAndRender(src, ctx))
      .to.eventually.equal(dst)
  })

  it('should support for with continue', function () {
    let src = '{% for i in (1..5) %}' +
            '{{i}}{% continue %}after' +
            '{% endfor %}'
    return expect(liquid.parseAndRender(src, ctx))
      .to.eventually.equal('12345')
  })
  it('should support for with break', function () {
    let src = '{% for i in (one..5) %}' +
      '{% if i == 4 %}{% break %}{% endif %}' +
      '{{ i }}' +
      '{% endfor %}'
    return expect(liquid.parseAndRender(src, ctx))
      .to.eventually.equal('123')
  })

  describe('limit', function () {
    it('should support for with limit', function () {
      let src = '{% for i in (1..5) limit:2 %}{{ i }}{% endfor %}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('12')
    })
    it('should set forloop.last properly', function () {
      let src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.last}} {%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('false true ')
    })
    it('should set forloop.first properly', function () {
      let src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.first}} {%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('true false ')
    })
    it('should set forloop.length properly', function () {
      let src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.length}} {%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('2 2 ')
    })
  })

  describe('offset', function () {
    it('should support offset with limit', function () {
      let src = '{% for i in (1..10) limit:2 offset:5%}{{ i }}{% endfor %}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('67')
    })
    it('should set index properly', function () {
      let src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.index}} {%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('1 2 ')
    })
    it('should set index0 properly', function () {
      let src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.index0}} {%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('0 1 ')
    })
    it('should set rindex properly', function () {
      let src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.rindex}} {%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('2 1 ')
    })
    it('should set rindex0 properly', function () {
      let src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.rindex0}} {%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('1 0 ')
    })
  })

  describe('reverse', function () {
    it('should support for reversed in the last position', function () {
      let src = '{% for i in (1..5) limit:2 reversed %}{{ i }}{% endfor %}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('21')
    })

    it('should support for reversed in the first position', function () {
      let src = '{% for i in (1..5) reversed limit:2 %}{{ i }}{% endfor %}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('21')
    })

    it('should support for reversed in the middle position', function () {
      let src = '{% for i in (1..5) offset:2 reversed limit:4 %}{{ i }}{% endfor %}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('543')
    })
  })
})
