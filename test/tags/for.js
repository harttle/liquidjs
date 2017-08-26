const Liquid = require('../..')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('tags/for', function () {
  var liquid, ctx
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
    var src = '{%for c in alpha%}{{c}}{%endfor%}'
    return expect(liquid.parseAndRender(src, ctx))
      .to.eventually.equal('abc')
  })

  it('should support object', function () {
    var src = '{%for key in obj%}{{key}}-{%else%}b{%endfor%}'
    return expect(liquid.parseAndRender(src, ctx))
      .to.eventually.equal('foo-coo-')
  })

  describe('scope', function () {
    it('should read super scope', function () {
      var src = '{%for a in (1..2)%}{{num}}{%endfor%}'
      return expect(liquid.parseAndRender(src, {num: 1}))
        .to.eventually.equal('11')
    })
    it('should write super scope', function () {
      var src = '{%for a in (1..2)%}{{num}}{%assign num = 2%}{%endfor%}'
      return expect(liquid.parseAndRender(src, {num: 1}))
        .to.eventually.equal('12')
    })
  })

  describe('illegal', function () {
    it('should reject when for not closed', function () {
      var src = '{%for c in alpha%}{{c}}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.be.rejectedWith(/tag .* not closed/)
    })

    it('should reject when inner templates rejected', function () {
      var src = '{%for c in alpha%}{%throwingTag%}{%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.be.rejectedWith(/intended render error/)
    })
  })

  describe('else', function () {
    it('should goto else for empty array', function () {
      var src = '{%for c in emptyArray%}a{%else%}b{%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('b')
    })

    it('should treat non-empty string as one single element', function () {
      var src = '{%for c in "abc"%}x{{c}}{%else%}y{%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('xabc')
    })

    it('should goto else for empty string', function () {
      var src = '{%for c in ""%}a{%else%}b{%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('b')
    })

    it('should goto else for empty string object', function () {
      // it should be false although `new String` is none-conform
      var src = '{%for c in strObj%}a{%else%}b{%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('b')
    })

    it('should goto else for empty object', function () {
      var src = '{%for c in emptyObj%}a{%else%}b{%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('b')
    })

    it('should goto else for null-prototyped object', function () {
      var src = '{%for c in nullProtoObj%}a{%else%}b{%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('b')
    })
  })

  it('should support for with forloop', function () {
    var src = '{%for c in alpha%}' +
            '{{forloop.first}}.{{forloop.index}}.{{forloop.index0}}.' +
            '{{forloop.last}}.{{forloop.length}}.' +
            '{{forloop.rindex}}.{{forloop.rindex0}}' +
            '{{c}}\n' +
            '{%endfor%}'
    var dst = 'true.1.0.false.3.3.2a\n' +
            'false.2.1.false.3.2.1b\n' +
            'false.3.2.true.3.1.0c\n'
    return expect(liquid.parseAndRender(src, ctx))
      .to.eventually.equal(dst)
  })

  it('should support for with continue', function () {
    var src = '{% for i in (1..5) %}' +
            '{{i}}{% continue %}after' +
            '{% endfor %}'
    return expect(liquid.parseAndRender(src, ctx))
      .to.eventually.equal('12345')
  })
  it('should support for with break', function () {
    var src = '{% for i in (one..5) %}' +
      '{% if i == 4 %}{% break %}{% endif %}' +
      '{{ i }}' +
      '{% endfor %}'
    return expect(liquid.parseAndRender(src, ctx))
      .to.eventually.equal('123')
  })

  describe('limit', function () {
    it('should support for with limit', function () {
      var src = '{% for i in (1..5) limit:2 %}{{ i }}{% endfor %}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('12')
    })
    it('should support for with limit and offset', function () {
      var src = '{% for i in (1..10) limit:2 offset:5%}{{ i }}{% endfor %}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('67')
    })
  })

  describe('reverse', function () {
    it('should support for reversed in the last position', function () {
      var src = '{% for i in (1..5) limit:2 reversed %}{{ i }}{% endfor %}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('21')
    })

    it('should support for reversed in the first position', function () {
      var src = '{% for i in (1..5) reversed limit:2 %}{{ i }}{% endfor %}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('21')
    })

    it('should support for reversed in the middle position', function () {
      var src = '{% for i in (1..5) offset:2 reversed limit:4 %}{{ i }}{% endfor %}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('543')
    })
  })
})
