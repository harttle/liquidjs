import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { Liquid } from '../../../src/liquid'
import { Drop } from '../../../src/drop/drop'
import { Scope } from '../../../src/context/scope'

use(chaiAsPromised)

describe('tags/for', function () {
  let liquid: Liquid, scope: Scope
  before(function () {
    liquid = new Liquid()
    liquid.registerTag('throwingTag', {
      render: function () { throw new Error('intended render error') }
    })
    scope = {
      one: 1,
      // eslint-disable-next-line
      strObj: new String(''),
      emptyObj: {},
      nullProtoObj: Object.create(null),
      obj: { foo: 'bar', coo: 'haa' },
      alpha: ['a', 'b', 'c'],
      promiseArray: Promise.resolve(['a', 'b', 'c']),
      emptyArray: []
    }
  })

  it('should support array', async function () {
    const src = '{%for c in alpha%}{{c}}{%endfor%}'
    const html = await liquid.parseAndRender(src, scope)
    return expect(html).to.equal('abc')
  })

  it('should support promise of array', async function () {
    const src = '{%for c in promiseArray%}{{c}}{%endfor%}'
    const html = await liquid.parseAndRender(src, scope)
    return expect(html).to.equal('abc')
  })

  it('should support object', async function () {
    const src = '{%for item in obj%}{{item[0]}},{{item[1]}}-{%else%}b{%endfor%}'
    const html = await liquid.parseAndRender(src, scope)
    return expect(html).to.equal('foo,bar-coo,haa-')
  })
  it('should output forloop', async function () {
    const src = '{%for i in (1..1)%}{{forloop}}{%endfor%}'
    const html = await liquid.parseAndRender(src, scope)
    return expect(html).to.equal('{"i":0,"length":1,"name":"i-(1..1)"}')
  })
  it('should output forloop collection name', async function () {
    const src = '{%for c in alpha%}{{forloop.name}}-{{c}}{%endfor%}'
    const html = await liquid.parseAndRender(src, scope)
    return expect(html).to.equal('c-alpha-ac-alpha-bc-alpha-c')
  })
  it('should output forloop property accessor name', async function () {
    const src = '{%for c in obj.foo%}{{forloop.name}}-{{c}}{%endfor%}'
    const html = await liquid.parseAndRender(src, scope)
    return expect(html).to.equal('c-obj.foo-bar')
  })
  it('should output forloop quoted name', async function () {
    const src = '{%for str in "string"%}{{forloop.name}}-{{str}}{%endfor%}'
    const html = await liquid.parseAndRender(src, scope)
    return expect(html).to.equal('str-"string"-string')
  })
  describe('illegal', function () {
    it('should reject when for not closed', function () {
      const src = '{%for c in alpha%}{{c}}'
      return expect(liquid.parseAndRender(src, scope))
        .to.be.rejectedWith(/tag .* not closed/)
    })

    it('should reject when for in not found', function () {
      const src = '{%for c alpha%}{{c}}'
      return expect(liquid.parseAndRender(src, scope))
        .to.be.rejectedWith('illegal tag: {%for c alpha%}, line:1, col:1')
    })

    it('should reject when inner templates rejected', function () {
      const src = '{%for c in alpha%}{%throwingTag%}{%endfor%}'
      return expect(liquid.parseAndRender(src, scope))
        .to.be.rejectedWith(/intended render error/)
    })
  })

  describe('else', function () {
    it('should goto else for empty array', async function () {
      const src = '{%for c in emptyArray%}a{%else%}b{%endfor%}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('b')
    })

    it('should treat non-empty string as one single element', async function () {
      const src = '{%for c in "abc"%}x{{c}}{%else%}y{%endfor%}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('xabc')
    })

    it('should goto else for empty string', async function () {
      const src = '{%for c in ""%}a{%else%}b{%endfor%}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('b')
    })

    it('should goto else for empty string object', async function () {
      // it should be false although `new String` is none-conform
      const src = '{%for c in strObj%}a{%else%}b{%endfor%}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('b')
    })

    it('should goto else for empty object', async function () {
      const src = '{%for c in emptyObj%}a{%else%}b{%endfor%}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('b')
    })

    it('should goto else for null-prototyped object', async function () {
      const src = '{%for c in nullProtoObj%}a{%else%}b{%endfor%}'
      const html = await liquid.parseAndRender(src, scope)
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
    const html = await liquid.parseAndRender(src, scope)
    return expect(html).to.equal(dst)
  })

  describe('continue', function () {
    it('should support for with continue', async function () {
      const src = '{% for i in (1..5) %}' +
              '{% if i == 4 %}continue{% continue %}{% endif %}{{i}}' +
              '{% endfor %}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('123continue5')
    })
    it('should output contents before continue', async function () {
      const src = '{% for i in (1..5) %}' +
        '{% if i == 4 %}continue{% continue %}{% endif %}' +
        '{{ i }}' +
        '{% endfor %}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('123continue5')
    })
  })
  describe('break', function () {
    it('should support break', async function () {
      const src = '{% for i in (one..5) %}' +
        '{% if i == 4 %}{% break %}{% endif %}' +
        '{{ i }}' +
        '{% endfor %}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('123')
    })
    it('should output contents before break', async function () {
      const src = '{% for i in (1..5) %}' +
        '{% if i == 4 %}breaking{% break %}{% endif %}' +
        '{{ i }}' +
        '{% endfor %}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('123breaking')
    })
  })

  describe('limit', function () {
    it('should support for with limit', async function () {
      const src = '{% for i in (1..5) limit:2 %}{{ i }}{% endfor %}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('12')
    })
    it('should set forloop.last properly', async function () {
      const src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.last}} {%endfor%}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('false true ')
    })
    it('should set forloop.first properly', async function () {
      const src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.first}} {%endfor%}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('true false ')
    })
    it('should set forloop.length properly', function () {
      const src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.length}} {%endfor%}'
      return expect(liquid.parseAndRender(src, scope))
        .to.eventually.equal('2 2 ')
    })
  })

  describe('offset', function () {
    it('should support offset with limit', async function () {
      const src = '{% for i in (1..10) limit:2 offset:5%}{{ i }}{% endfor %}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('67')
    })
    it('should set index properly', async function () {
      const src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.index}} {%endfor%}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('1 2 ')
    })
    it('should set index0 properly', async function () {
      const src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.index0}} {%endfor%}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('0 1 ')
    })
    it('should set rindex properly', async function () {
      const src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.rindex}} {%endfor%}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('2 1 ')
    })
    it('should set rindex0 properly', async function () {
      const src = '{%for i in (1..10) limit:2 offset:3%}{{forloop.rindex0}} {%endfor%}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('1 0 ')
    })
    it('should continue from limit-ed loop', async function () {
      const src = '{%for i in arr limit:2%}{{i}}{%endfor%}-{%for i in arr offset:continue%}{{i}}{%endfor%}'
      const html = await liquid.parseAndRender(src, { arr: [1, 2, 3, 4, 5] })
      return expect(html).to.equal('12-345')
    })
    it('should continue nothing for fully iterated loop', async function () {
      const src = '{%for i in arr%}{{i}}{%endfor%}-{%for i in arr offset:continue%}{{i}}{%endfor%}'
      const html = await liquid.parseAndRender(src, { arr: [1, 2, 3, 4, 5] })
      return expect(html).to.equal('12345-')
    })
    it('should treat different variable names as different forloop', async function () {
      const src = '{%for i in (1..5)%}{{i}}{%endfor%}-{%for j in (1..5) offset:continue%}{{j}}{%endfor%}'
      const html = await liquid.parseAndRender(src, {})
      return expect(html).to.equal('12345-12345')
    })
    it('should treat different collection names as different forloop', async function () {
      const src = '{%for i in arr1%}{{i}}{%endfor%}-{%for i in arr2 offset:continue%}{{i}}{%endfor%}'
      const arr = [1, 2, 3, 4, 5]
      const html = await liquid.parseAndRender(src, { arr1: arr, arr2: arr })
      return expect(html).to.equal('12345-12345')
    })
  })

  describe('reversed', function () {
    it('should support for reversed in the last position', async function () {
      const src = '{% for i in (1..8) limit:2 reversed %}{{ i }}{% endfor %}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('21')
    })

    it('should support for reversed in the first position', async function () {
      const src = '{% for i in (1..8) reversed limit:2 %}{{ i }}{% endfor %}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('21')
    })

    it('should support for reversed in the first position with orderedFilterParameters=true', async function () {
      const liquid = new Liquid({ orderedFilterParameters: true })
      const src = '{% for i in (1..8) reversed limit:2 %}{{ i }}{% endfor %}'
      const html = await liquid.parseAndRender(src, scope)
      return expect(html).to.equal('87')
    })

    it('should support for reversed in the middle position', async function () {
      const src = '{% for i in (1..8) offset:2 reversed limit:3 %}{{ i }}{% endfor %}'
      const html = await liquid.parseAndRender(src)
      return expect(html).to.equal('543')
    })

    it('should support for reversed in the middle position with orderedFilterParameters=true', async function () {
      const liquid = new Liquid({ orderedFilterParameters: true })
      const src = '{% for i in (1..8) offset:2 reversed limit:3 %}{{ i }}{% endfor %}'
      const html = await liquid.parseAndRender(src)
      return expect(html).to.equal('876')
    })
  })

  describe('sync', function () {
    it('should support sync', function () {
      const src = '{% for i in (1..5) %}{{i}}{%endfor%}'
      const html = liquid.parseAndRenderSync(src)
      return expect(html).to.equal('12345')
    })
    it('should output contents before break', function () {
      const src = '{% for i in (1..5) %}' +
        '{% if i == 4 %}breaking{% break %}{% endif %}' +
        '{{ i }}' +
        '{% endfor %}'
      const html = liquid.parseAndRenderSync(src, scope)
      return expect(html).to.equal('123breaking')
    })
    it('should support for with continue', function () {
      const src = '{% for i in (1..5) %}' +
              '{% if i == 4 %}continue{% continue %}{% endif %}{{i}}' +
              '{% endfor %}'
      const html = liquid.parseAndRenderSync(src, scope)
      return expect(html).to.equal('123continue5')
    })
    it('should goto else for empty array', async function () {
      const src = '{%for c in emptyArray%}a{%else%}b{%endfor%}'
      const html = await liquid.parseAndRenderSync(src, scope)
      return expect(html).to.equal('b')
    })
  })

  describe('iterables', function () {
    class MockIterable {
      * [Symbol.iterator] () {
        yield 'a'
        yield 'b'
        yield 'c'
      }
    }

    class MockEmptyIterable {
      * [Symbol.iterator] () {}
    }

    class MockIterableDrop extends Drop {
      * [Symbol.iterator] () {
        yield 'a'
        yield 'b'
        yield 'c'
      }
      toString () {
        return 'MockIterableDrop'
      }
    }

    it('should loop over iterable objects', function () {
      const src = '{% for i in someIterable %}{{i}}{%endfor%}'
      const html = liquid.parseAndRenderSync(src, { someIterable: new MockIterable() })
      return expect(html).to.equal('abc')
    })
    it('should loop over iterable drops', function () {
      const src = '{{ someDrop }}: {% for i in someDrop %}{{i}}{%endfor%}'
      const html = liquid.parseAndRenderSync(src, { someDrop: new MockIterableDrop() })
      return expect(html).to.equal('MockIterableDrop: abc')
    })
    it('should loop over iterable objects with a limit', function () {
      const src = '{% for i in someIterable limit:2 %}{{i}}{%endfor%}'
      const html = liquid.parseAndRenderSync(src, { someIterable: new MockIterable() })
      return expect(html).to.equal('ab')
    })
    it('should loop over iterable objects with an offset', function () {
      const src = '{% for i in someIterable offset:1 %}{{i}}{%endfor%}'
      const html = liquid.parseAndRenderSync(src, { someIterable: new MockIterable() })
      return expect(html).to.equal('bc')
    })
    it('should loop over iterable objects in reverse', function () {
      const src = '{% for i in someIterable reversed %}{{i}}{%endfor%}'
      const html = liquid.parseAndRenderSync(src, { someIterable: new MockIterable() })
      return expect(html).to.equal('cba')
    })
    it('should go to else for an empty iterable', function () {
      const src = '{% for i in emptyIterable reversed %}{{i}}{%else%}EMPTY{%endfor%}'
      const html = liquid.parseAndRenderSync(src, { emptyIterable: new MockEmptyIterable() })
      return expect(html).to.equal('EMPTY')
    })
    it('should support iterable names', function () {
      const src = '{% for i in someDrop %}{{forloop.name}} {%else%}EMPTY{%endfor%}'
      const html = liquid.parseAndRenderSync(src, { someDrop: new MockIterableDrop() })
      return expect(html).to.equal('i-someDrop i-someDrop i-someDrop ')
    })
  })
})
