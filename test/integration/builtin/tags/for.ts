import Liquid from '../../../../src/liquid'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { Scope } from '../../../../src/context/scope'

use(chaiAsPromised)

describe('tags/for', function () {
  let liquid: Liquid, ctx: Scope
  before(function () {
    liquid = new Liquid()
    liquid.registerTag('throwingTag', {
      render: function () { throw new Error('intended render error') }
    })
    ctx = {
      one: 1,
      // eslint-disable-next-line
      strObj: new String(''),
      emptyObj: {},
      nullProtoObj: Object.create(null),
      obj: { foo: 'bar', coo: 'haa' },
      alpha: ['a', 'b', 'c'],
      emptyArray: []
    }
  })
  it('should support array', async function () {
    const src = '{%for c in alpha%}{{c}}{%endfor%}'
    const html = await liquid.parseAndRender(src, ctx)
    return expect(html).to.equal('abc')
  })

  it('should support object', async function () {
    const src = '{%for item in obj%}{{item[0]}},{{item[1]}}-{%else%}b{%endfor%}'
    const html = await liquid.parseAndRender(src, ctx)
    return expect(html).to.equal('foo,bar-coo,haa-')
  })
  it('should output forloop', async function () {
    const src = '{%for i in (1..1)%}{{forloop}}{%endfor%}'
    const html = await liquid.parseAndRender(src, ctx)
    return expect(html).to.equal('{"i":0,"length":1}')
  })
  describe('illegal', function () {
    it('should reject when for not closed', function () {
      const src = '{%for c in alpha%}{{c}}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.be.rejectedWith(/tag .* not closed/)
    })

    it('should reject when inner templates rejected', function () {
      const src = '{%for c in alpha%}{%throwingTag%}{%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.be.rejectedWith(/intended render error/)
    })
  })

  describe('else', function () {
    it('should goto else for empty array', async function () {
      const src = '{%for c in emptyArray%}a{%else%}b{%endfor%}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('b')
    })

    it('should treat non-empty string as one single element', async function () {
      const src = '{%for c in "abc"%}x{{c}}{%else%}y{%endfor%}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('xabc')
    })

    it('should goto else for empty string', async function () {
      const src = '{%for c in ""%}a{%else%}b{%endfor%}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('b')
    })

    it('should goto else for empty string object', async function () {
      // it should be false although `new String` is none-conform
      const src = '{%for c in strObj%}a{%else%}b{%endfor%}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('b')
    })

    it('should goto else for empty object', async function () {
      const src = '{%for c in emptyObj%}a{%else%}b{%endfor%}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('b')
    })

    it('should goto else for null-prototyped object', async function () {
      const src = '{%for c in nullProtoObj%}a{%else%}b{%endfor%}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('b')
    })
  })

  it('should support for with forloop', async function () {
    const src = '{%for c in alpha%}' +
            '{{forloop.first}}.{{forloop.index}}.{{forloop.index0}}.' +
            '{{forloop.last}}.{{forloop.length}}.' +
            '{{forloop.rindex}}.{{forloop.rindex0}}' +
            '{{c}}\n' +
            '{%endfor%}'
    const dst = 'true.1.0.false.3.3.2a\n' +
            'false.2.1.false.3.2.1b\n' +
            'false.3.2.true.3.1.0c\n'
    const html = await liquid.parseAndRender(src, ctx)
    return expect(html).to.equal(dst)
  })

  it('should support for with continue', async function () {
    const src = '{% for i in (1..5) %}' +
            '{{i}}{% continue %}after' +
            '{% endfor %}'
    const html = await liquid.parseAndRender(src, ctx)
    return expect(html).to.equal('12345')
  })
  it('should support for with break', async function () {
    const src = '{% for i in (one..5) %}' +
      '{% if i == 4 %}{% break %}{% endif %}' +
      '{{ i }}' +
      '{% endfor %}'
    const html = await liquid.parseAndRender(src, ctx)
    return expect(html).to.equal('123')
  })

  describe('limit', function () {
    it('should support for with limit', async function () {
      const src = '{% for i in (1..5) limit:2 %}{{ i }}{% endfor %}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('12')
    })
    it('should set forloop.last properly', async function () {
      const src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.last}} {%endfor%}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('false true ')
    })
    it('should set forloop.first properly', async function () {
      const src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.first}} {%endfor%}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('true false ')
    })
    it('should set forloop.length properly', function () {
      const src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.length}} {%endfor%}'
      return expect(liquid.parseAndRender(src, ctx))
        .to.eventually.equal('2 2 ')
    })
  })

  describe('offset', function () {
    it('should support offset with limit', async function () {
      const src = '{% for i in (1..10) limit:2 offset:5%}{{ i }}{% endfor %}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('67')
    })
    it('should set index properly', async function () {
      const src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.index}} {%endfor%}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('1 2 ')
    })
    it('should set index0 properly', async function () {
      const src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.index0}} {%endfor%}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('0 1 ')
    })
    it('should set rindex properly', async function () {
      const src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.rindex}} {%endfor%}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('2 1 ')
    })
    it('should set rindex0 properly', async function () {
      const src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.rindex0}} {%endfor%}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('1 0 ')
    })
  })

  describe('reverse', function () {
    it('should support for reversed in the last position', async function () {
      const src = '{% for i in (1..5) limit:2 reversed %}{{ i }}{% endfor %}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('21')
    })

    it('should support for reversed in the first position', async function () {
      const src = '{% for i in (1..5) reversed limit:2 %}{{ i }}{% endfor %}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('21')
    })

    it('should support for reversed in the middle position', async function () {
      const src = '{% for i in (1..5) offset:2 reversed limit:4 %}{{ i }}{% endfor %}'
      const html = await liquid.parseAndRender(src, ctx)
      return expect(html).to.equal('543')
    })
  })
})
