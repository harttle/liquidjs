import { Liquid } from '../../../src/liquid'

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

  it('should still block __proto__ when ownPropertyOnly=false', async function () {
    const scope = { foo: { __proto__: { bar: 'BAR' } } }
    await expect(liquid.parseAndRender('{{ foo.__proto__.bar }}', scope, { ownPropertyOnly: false })).resolves.toBe('')
  })
})
