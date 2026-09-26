import { Liquid, Drop } from '../../../src'
import { mock, restore } from '../../stub/mockfs'

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
  it('should support promise returned by valueOf', async () => {
    class AsyncValueOfDrop extends Drop {
      id = '42'
      async valueOf () {
        return 'serialized'
      }
    }
    const html = await liquid.parseAndRender(
      `{{o.id}}:{{o}}:{% if o %}yes{% endif %}:{% unless o %}no{% endunless %}`,
      { o: new AsyncValueOfDrop() }
    )
    expect(html).toBe('42:serialized:yes:')
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

  describe('async valueOf', function () {
    beforeEach(() => {
      liquid = new Liquid({ root: '/', extname: '.html' })
    })
    afterEach(restore)

    class AsyncStringDrop extends Drop {
      constructor (private value: string) { super() }
      async valueOf () {
        return this.value
      }
    }

    class AsyncFalsyDrop extends Drop {
      async valueOf () {
        return false
      }
    }

    class AsyncArrayDrop extends Drop {
      constructor (private value: string[]) { super() }
      async valueOf () {
        return this.value
      }
    }

    class AsyncNumberDrop extends Drop {
      constructor (private value: number) { super() }
      async valueOf () {
        return this.value
      }
    }

    describe('output & filters', function () {
      it('output {{ drop }}', async function () {
        const html = await liquid.parseAndRender(`{{a}}`, { a: new AsyncStringDrop('x') })
        expect(html).toBe('x')
      })
      it('passes the raw Drop to filters (not its async valueOf)', async function () {
        liquid.registerFilter('typeName', x => x.constructor.name)
        const html = await liquid.parseAndRender(`{{a | typeName}}`, { a: new AsyncStringDrop('ab') })
        expect(html).toBe('AsyncStringDrop')
      })
      it('where by async property', async function () {
        const items = [{ v: new AsyncStringDrop('x'), id: '1' }, { v: new AsyncStringDrop('y'), id: '2' }]
        const html = await liquid.parseAndRender(`{% assign r = items | where: 'v', 'y' %}{{ r[0].id }}`, { items })
        expect(html).toBe('2')
      })
      it('find by async property', async function () {
        const items = [{ v: new AsyncStringDrop('x'), id: '1' }, { v: new AsyncStringDrop('y'), id: '2' }]
        const html = await liquid.parseAndRender(`{% assign f = items | find: 'v', 'y' %}{{ f.id }}`, { items })
        expect(html).toBe('2')
      })
      it('group_by async property', async function () {
        const items = [{ v: new AsyncStringDrop('x') }, { v: new AsyncStringDrop('x') }, { v: new AsyncStringDrop('y') }]
        const html = await liquid.parseAndRender(`{{ items | group_by: 'v' | size }}`, { items })
        expect(html).toBe('2')
      })
    })

    describe('branch conditions', function () {
      it('if truthy', async function () {
        const html = await liquid.parseAndRender(`{% if a %}yes{% else %}no{% endif %}`, { a: new AsyncStringDrop('x') })
        expect(html).toBe('yes')
      })
      it('if falsy', async function () {
        const html = await liquid.parseAndRender(`{% if a %}yes{% else %}no{% endif %}`, { a: new AsyncFalsyDrop() })
        expect(html).toBe('no')
      })
      it('unless', async function () {
        const html = await liquid.parseAndRender(`{% unless a %}yes{% else %}no{% endunless %}`, { a: new AsyncFalsyDrop() })
        expect(html).toBe('yes')
      })
      it('elsif', async function () {
        const html = await liquid.parseAndRender(
          `{% if false %}a{% elsif b %}b{% else %}c{% endif %}`,
          { b: new AsyncStringDrop('x') }
        )
        expect(html).toBe('b')
      })
      it('case/when', async function () {
        const html = await liquid.parseAndRender(
          `{% case a %}{% when "x" %}X{% when "y" %}Y{% else %}Z{% endcase %}`,
          { a: new AsyncStringDrop('y') }
        )
        expect(html).toBe('Y')
      })
    })

    describe('operators', function () {
      it('== / !=', async function () {
        const html = await liquid.parseAndRender(
          `{% if a == b %}eq{% endif %}/{% if a != c %}ne{% endif %}`,
          { a: new AsyncStringDrop('t'), b: new AsyncStringDrop('t'), c: new AsyncStringDrop('u') }
        )
        expect(html).toBe('eq/ne')
      })
      it('< / >', async function () {
        const html = await liquid.parseAndRender(
          `{% if a < b %}lt{% endif %}/{% if b > a %}gt{% endif %}`,
          { a: new AsyncNumberDrop(1), b: new AsyncNumberDrop(2) }
        )
        expect(html).toBe('lt/gt')
      })
      it('contains', async function () {
        const html = await liquid.parseAndRender(
          `{% if a contains "od" %}yes{% endif %}`,
          { a: new AsyncStringDrop('product') }
        )
        expect(html).toBe('yes')
      })
      it('and / or', async function () {
        const html = await liquid.parseAndRender(
          `{% if a and b %}both{% endif %}/{% if f or a %}either{% endif %}`,
          { a: new AsyncStringDrop('x'), b: new AsyncStringDrop('y'), f: new AsyncFalsyDrop() }
        )
        expect(html).toBe('both/either')
      })
      it('not (unless)', async function () {
        const html = await liquid.parseAndRender(
          `{% unless a %}yes{% else %}no{% endunless %}`,
          { a: new AsyncFalsyDrop() }
        )
        expect(html).toBe('yes')
      })
    })

    describe('collections', function () {
      it('for collection', async function () {
        const html = await liquid.parseAndRender(
          `{% for x in a %}{{ x }};{% endfor %}`,
          { a: new AsyncArrayDrop(['u', 'v']) }
        )
        expect(html).toBe('u;v;')
      })
      it('tablerow collection', async function () {
        const html = await liquid.parseAndRender(
          `{% tablerow x in a cols:2 %}{{ x }}{% endtablerow %}`,
          { a: new AsyncArrayDrop(['u', 'v']) }
        )
        expect(html).toContain('u')
        expect(html).toContain('v')
      })
      it('render for collection', async function () {
        mock({
          '/item.html': '{{ x }}'
        })
        const html = await liquid.parseAndRender(
          `{% render "item" for a as x %}`,
          { a: new AsyncArrayDrop(['u', 'v']) }
        )
        expect(html).toBe('uv')
      })
      it('cycle candidate', async function () {
        const html = await liquid.parseAndRender(
          `{% cycle a, b %}{% cycle a, b %}`,
          { a: new AsyncStringDrop('x'), b: new AsyncStringDrop('y') }
        )
        expect(html).toBe('xy')
      })
      it('tag named arg (tablerow cols)', async function () {
        const html = await liquid.parseAndRender(
          `{% tablerow i in (1..4) cols: c %}{{ i }}{% endtablerow %}`,
          { c: new AsyncNumberDrop(2) }
        )
        expect(html).toBe('<tr class="row1"><td class="col1">1</td><td class="col2">2</td></tr><tr class="row2"><td class="col1">3</td><td class="col2">4</td></tr>')
      })
    })

    describe('pass-through tags', function () {
      it('assign then output', async function () {
        const html = await liquid.parseAndRender(`{% assign b = a %}{{ b }}`, { a: new AsyncStringDrop('z') })
        expect(html).toBe('z')
      })
      it('echo', async function () {
        const html = await liquid.parseAndRender(`{% echo a %}`, { a: new AsyncStringDrop('z') })
        expect(html).toBe('z')
      })
      it('render with', async function () {
        mock({
          '/c.html': '{{ color }}'
        })
        const html = await liquid.parseAndRender(
          `{% render "c" with a as color %}`,
          { a: new AsyncStringDrop('red') }
        )
        expect(html).toBe('red')
      })
      it('include with', async function () {
        mock({
          '/color.html': '{{ color }}'
        })
        const html = await liquid.parseAndRender(
          `{% include "color" with a %}`,
          { a: new AsyncStringDrop('red') }
        )
        expect(html).toBe('red')
      })
    })
  })
})
