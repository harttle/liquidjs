import { Liquid } from '../../../src/liquid'
import { Drop } from '../../../src/drop/drop'

describe('scope security', function () {
  let liquid: Liquid

  beforeEach(function () {
    liquid = new Liquid()
  })

  it('should not read __proto__ from passed scope', async function () {
    const scope = JSON.parse('{"__proto__": {"polluted": true}, "name": "Alice"}')
    await expect(liquid.parseAndRender('{{ name }}', scope)).resolves.toBe('Alice')
    await expect(liquid.parseAndRender('{{ __proto__.polluted }}', scope)).resolves.toBe('')
  })

  it('should not read constructor from passed scope', async function () {
    const scope = { name: 'Alice', constructor: { name: 'Object' } }
    await expect(liquid.parseAndRender('{{ constructor.name }}', scope)).resolves.toBe('')
  })

  it('should block inherited constructor when ownPropertyOnly=false', async function () {
    await expect(liquid.parseAndRender('{{ foo.constructor.name }}', { foo: {} }, { ownPropertyOnly: false })).resolves.toBe('')
    await expect(liquid.parseAndRender('{{ constructor.name }}', { name: 'Alice' }, { ownPropertyOnly: false })).resolves.toBe('')
  })

  it('should iterate plain objects via inherited Symbol.iterator (ownPropertyOnly exception)', async function () {
    // eslint-disable-next-line no-extend-native
    (Object.prototype as any)[Symbol.iterator] = function * () { yield 'inherited' }
    try {
      await expect(liquid.parseAndRender(
        '{% for x in obj %}{{ x }}{% endfor %}',
        { obj: {} }
      )).resolves.toBe('inherited')
    } finally {
      delete (Object.prototype as any)[Symbol.iterator]
    }
  })

  it('should not read inherited size on plain objects', async function () {
    const obj = Object.create({ size: 99 })
    obj.own = 'yes'
    await expect(liquid.parseAndRender('{{ obj.size }}', { obj })).resolves.toBe('1')
  })

  it('should still iterate Drop with Symbol.iterator', async function () {
    class IterableDrop extends Drop {
      * [Symbol.iterator] () {
        yield 'a'
        yield 'b'
      }
    }
    await expect(liquid.parseAndRender(
      '{% for x in drop %}{{ x }}{% endfor %}',
      { drop: new IterableDrop() }
    )).resolves.toBe('ab')
  })
})
