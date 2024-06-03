import { Liquid, Drop } from '../../../src'

describe('drop/drop', function () {
  let liquid: Liquid
  beforeEach(() => (liquid = new Liquid()))

  class CustomDrop extends Drop {
    private name = 'NAME'
    public getName () {
      return 'GET NAME'
    }
  }
  class CustomDropWithMethodMissing extends CustomDrop {
    public liquidMethodMissing (key: string) {
      return key.toUpperCase()
    }
  }
  class PromiseDrop extends Drop {
    private name = Promise.resolve('NAME')
    public async getName () {
      return 'GET NAME'
    }
    public async liquidMethodMissing (key: string) {
      return key.toUpperCase()
    }
  }
  it('should call corresponding method when output', async function () {
    const html = await liquid.parseAndRender(`{{obj.getName}}`, { obj: new CustomDrop() })
    expect(html).toBe('GET NAME')
  })
  it('should call corresponding method when expression evaluates', async function () {
    const html = await liquid.parseAndRender(`{% if obj.getName == "GET NAME" %}true{% endif %}`, { obj: new CustomDrop() })
    expect(html).toBe('true')
  })
  it('should read corresponding property', async function () {
    const html = await liquid.parseAndRender(`{{obj.name}}`, { obj: new CustomDrop() })
    expect(html).toBe('NAME')
  })
  it('should output empty string if not exist', async function () {
    const html = await liquid.parseAndRender(`{{obj.foo}}`, { obj: new CustomDrop() })
    expect(html).toBe('')
  })
  it('should respect liquidMethodMissing', async function () {
    const html = await liquid.parseAndRender(`{{obj.foo}}`, { obj: new CustomDropWithMethodMissing() })
    expect(html).toBe('FOO')
  })
  it('should call corresponding promise method', async function () {
    const html = await liquid.parseAndRender(`{{obj.getName}}`, { obj: new PromiseDrop() })
    expect(html).toBe('GET NAME')
  })
  it('should read corresponding promise property', async function () {
    const html = await liquid.parseAndRender(`{{obj.name}}`, { obj: new PromiseDrop() })
    expect(html).toBe('NAME')
  })
  it('should resolve before calling filters', async function () {
    const html = await liquid.parseAndRender(`{{obj.name | downcase}}`, { obj: new PromiseDrop() })
    expect(html).toBe('name')
  })
  it('should support promise returned by liquidMethodMissing', async function () {
    const html = await liquid.parseAndRender(`{{obj.foo}}`, { obj: new PromiseDrop() })
    expect(html).toBe('FOO')
  })
  it('should respect valueOf', async () => {
    class CustomDrop extends Drop {
      prop = 'not enumerable'
      valueOf () {
        return ['foo', 'bar']
      }
    }
    const tpl = '{{drop}}: {% for field in drop %}{{ field }};{% endfor %}'
    const html = await liquid.parseAndRender(tpl, { drop: new CustomDrop() })
    expect(html).toBe('foobar: foo;bar;')
  })
  it('should support valueOf in == expression', async () => {
    class AddressDrop extends Drop {
      valueOf () {
        return 'test'
      }
    }
    const address = new AddressDrop()
    const customer = { default_address: new AddressDrop() }
    const tpl = `{% if address == customer.default_address %}{{address}}{% endif %}`
    const html = await liquid.parseAndRender(tpl, { address, customer })
    expect(html).toBe('test')
  })
  it('should correctly evaluate custom Drop objects with equals function without full Comparable implementation', async () => {
    class TestDrop extends Drop {
      value: string;
      constructor () {
        super()
        this.value = 'test'
      }
      equals (rhs: string): boolean {
        return this.valueOf() === rhs
      }
      valueOf (): string {
        return this.value
      }
    }
    const address = new TestDrop()
    const customer = { default_address: new TestDrop() }
    const tpl = `{{ address >= customer.default_address }}`
    const html = await liquid.parseAndRender(tpl, { address, customer })
    expect(html).toBe('true')
  })
  it('should support returning supported value types from liquidMethodMissing', async function () {
    class DynamicTypeDrop extends Drop {
      liquidMethodMissing (key: string) {
        switch (key) {
          case 'number': return 42
          case 'string': return 'foo'
          case 'boolean': return true
          case 'array': return [1, 2, 3]
          case 'object': return { foo: 'bar' }
          case 'drop': return new CustomDrop()
        }
      }
    }
    const html = await liquid.parseAndRender(`{{obj.number}} {{obj.string}} {{obj.boolean}} {{obj.array | first}} {{obj.object.foo}} {{obj.drop.getName}}`, { obj: new DynamicTypeDrop() })
    expect(html).toBe('42 foo true 1 bar GET NAME')
  })
})
