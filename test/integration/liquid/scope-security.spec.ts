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

  it('should not read prototype chain properties by default', async function () {
    const scope = { user: Object.create({ isAdmin: true, name: 'Inherited' }) }
    scope.user.name = 'Alice'
    await expect(liquid.parseAndRender('{{ user.name }}', scope)).resolves.toBe('Alice')
    await expect(liquid.parseAndRender('{{ user.isAdmin }}', scope)).resolves.toBe('')
  })

  it('should not expose Object.prototype keys from polluted scope', async function () {
    const scope = Object.create({ polluted: 'yes' })
    scope.safe = 'ok'
    await expect(liquid.parseAndRender('{{ safe }}', scope)).resolves.toBe('ok')
    await expect(liquid.parseAndRender('{{ polluted }}', scope)).resolves.toBe('')
  })

  it('should block assign to __proto__ from being read back', async function () {
    await expect(liquid.parseAndRender(
      '{% assign __proto__ = obj %}{{ __proto__.polluted }}',
      { obj: { polluted: true } }
    )).resolves.toBe('')
  })

  it('should still allow increment on user scope', async function () {
    const scope = { counter: 0 }
    await expect(liquid.parseAndRender('{% increment counter %}', scope)).resolves.toBe('0')
    await expect(liquid.parseAndRender('{% increment counter %}', scope)).resolves.toBe('1')
    expect(scope.counter).toBe(2)
  })

  it('should allow ownPropertyOnly=false to read prototype values', async function () {
    const scope = { foo: Object.create({ bar: 'BAR' }) }
    await expect(liquid.parseAndRender('{{ foo.bar }}', scope, { ownPropertyOnly: false })).resolves.toBe('BAR')
  })

  it('should still block inherited __proto__ when ownPropertyOnly=false', async function () {
    const scope = { foo: Object.create({ __proto__: { bar: 'BAR' } }) }
    await expect(liquid.parseAndRender('{{ foo.__proto__.bar }}', scope, { ownPropertyOnly: false })).resolves.toBe('')
  })

  it('should allow own __proto__ when ownPropertyOnly=false', async function () {
    const scope = { foo: JSON.parse('{"__proto__": {"bar": "BAR"}}') }
    await expect(liquid.parseAndRender('{{ foo.__proto__.bar }}', scope, { ownPropertyOnly: false })).resolves.toBe('BAR')
  })

  it('should allow own constructor when ownPropertyOnly=false', async function () {
    const scope = { name: 'Alice', constructor: { name: 'Custom' } }
    await expect(liquid.parseAndRender('{{ constructor.name }}', scope, { ownPropertyOnly: false })).resolves.toBe('Custom')
  })

  it('should still block inherited constructor when ownPropertyOnly=false', async function () {
    const scope = { foo: {} }
    await expect(liquid.parseAndRender('{{ foo.constructor.name }}', scope, { ownPropertyOnly: false })).resolves.toBe('')
  })

  it('should not resolve top-level inherited constructor when ownPropertyOnly=false', async function () {
    await expect(liquid.parseAndRender('{{ constructor.name }}', { name: 'Alice' }, { ownPropertyOnly: false })).resolves.toBe('')
  })

  it('should not write increment to __proto__ on user scope', async function () {
    const scope = Object.create(null) as Record<string, unknown>
    await expect(liquid.parseAndRender('{% increment __proto__ %}', scope)).resolves.toBe('')
    expect(Object.prototype).toEqual(Object.prototype)
    expect(scope).toEqual({})
  })

  it('should not write assign to __proto__ on user scope', async function () {
    const scope = { safe: 'ok' }
    await expect(liquid.parseAndRender(
      '{% assign __proto__ = obj %}',
      { ...scope, obj: { polluted: true } }
    )).resolves.toBe('')
    expect((Object.prototype as any).polluted).toBeUndefined()
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
