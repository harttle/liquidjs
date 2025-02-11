import { test, render } from '../../stub/render'
import { Liquid } from '../../../src/liquid'

describe('filters/array', function () {
  const engine = new Liquid()
  describe('index', function () {
    it('should support index', function () {
      const src = '{% assign beatles = "John, Paul, George, Ringo" | split: ", " %}' +
        '{{ beatles[1] }}'
      return test(src, 'Paul')
    })
  })
  describe('join', function () {
    it('should support join', function () {
      const src = '{% assign beatles = "John, Paul, George, Ringo" | split: ", " %}' +
        '{{ beatles | join: " and " }}'
      return test(src, 'John and Paul and George and Ringo')
    })
    it('should default separator to space', function () {
      const src = '{% assign beatles = "John, Paul, George, Ringo" | split: ", " %}' +
        '{{ beatles | join }}'
      return test(src, 'John Paul George Ringo')
    })
    it('should throw when comma missing', async () => {
      const src = '{% assign beatles = "John, Paul, George, Ringo" | split: ", " %}' +
        '{{ beatles | join " and " }}'
      return expect(render(src)).rejects.toThrow('expected ":" after filter name, line:1, col:83')
    })
  })
  describe('split', () => {
    it('should support split', function () {
      const src = '{% assign my_array = "zebra, octopus, giraffe, tiger" | split: ", " %}' +
        '{{ my_array|last }}'
      return test(src, 'tiger')
    })
    it('should remove trailing empty strings', async () => {
      const src = '{{ "zebra,octopus,,,," | split: "," | join: ", " }}'
      return test(src, {}, 'zebra, octopus')
    })
    it('should return empty array for nil value', async () => {
      await test('{{ notDefined | split: "," | size }}', {}, '0')
      await test('{{ nil | split: "," | size }}', {}, '0')
    })
  })
  describe('map', () => {
    it('should support map', function () {
      const posts = [{ category: 'foo' }, { category: 'bar' }]
      return test('{{posts | map: "category"}}', { posts }, 'foobar')
    })
    it('should normalize non-array input', function () {
      const post = { category: 'foo' }
      return test('{{post | map: "category"}}', { post }, 'foo')
    })
    it('should allow nil results in strictVariables mode', function () {
      const engine = new Liquid({ strictVariables: true })
      const ctx = {
        posts: [{ category: 'foo' }, { title: 'bar' }]
      }
      const result = engine.parseAndRenderSync('{{posts | map: "category" | json}}', ctx)
      expect(result).toEqual('["foo",null]')
    })
    it('should support nested property', function () {
      const tpl = '{{ arr | map: "name.first" | join }}'
      const a = { name: { first: 'Alice' } }
      const b = { name: { first: 'Bob' } }
      const c = { name: { first: 'Carol' } }
      return test(tpl, { arr: [a, b, c] }, 'Alice Bob Carol')
    })
  })
  describe('sum', () => {
    it('should support sum with no args', function () {
      const ages = [21, null, -4, '4.5', 13.25, undefined, 0]
      return test('{{ages | sum}}', { ages }, '34.75')
    })
    it('should support sum with property', function () {
      const ages = [21, null, -4, '4.5', 13.25, undefined, 0].map(x => ({ age: x }))
      return test('{{ages | sum: "age"}}', { ages }, '34.75')
    })
    it('should support sum with nested property', function () {
      const ages = [21, null, -4, '4.5', 13.25, undefined, 0].map(x => ({ age: { first: x } }))
      return test('{{ages | sum: "age.first"}}', { ages }, '34.75')
    })
    it('should support non-array input', function () {
      const age = 21.5
      return test('{{age | sum}}', { age }, '21.5')
    })
    it('should coerce missing property to zero', function () {
      const ages = [{ qty: 1 }, { qty: 2, cnt: 3 }, { cnt: 4 }]
      return test('{{ages | sum}} {{ages | sum: "cnt"}} {{ages | sum: "other"}}', { ages }, '0 7 0')
    })
    it('should coerce indexable non-map values to zero', function () {
      const input = [1, 'foo', { quantity: 3 }]
      return test('{{input | sum}}', { input }, '1')
    })
    it('should coerce unindexable values to zero', function () {
      const input = [1, null, { quantity: 2 }]
      return test('{{input | sum}}', { input }, '1')
    })
    it('should coerce true to 1', function () {
      const input = [1, true, null, { quantity: 2 }]
      return test('{{input | sum}}', { input }, '2')
    })
    it('should not support nested arrays', function () {
      const ages = [1, [2, [3, 4]]]
      return test('{{ages | sum}}', { ages }, '1')
    })
  })
  describe('compact', () => {
    it('should compact array', function () {
      const posts = [{ category: 'foo' }, { category: 'bar' }, { foo: 'bar' }]
      return test('{{posts | map: "category" | compact}}', { posts }, 'foobar')
    })
  })

  describe('concat', () => {
    it('should concat args value', async () => {
      const scope = { val: ['hey'], arr: ['foo', 'bar'] }
      await test('{{ val | concat: arr | join: "," }}', scope, 'hey,foo,bar')
    })
    it('should support undefined left value', async () => {
      const scope = { arr: ['foo', 'bar'] }
      await test('{{ notDefined | concat: arr | join: "," }}', scope, 'foo,bar')
    })
    it('should ignore nil left value', async () => {
      const scope = { undefinedValue: undefined, nullValue: null, arr: ['foo', 'bar'] }
      await test('{{ undefinedValue | concat: arr | join: "," }}', scope, 'foo,bar')
      await test('{{ nullValue | concat: arr | join: "," }}', scope, 'foo,bar')
    })
    it('should ignore nil right value', async () => {
      const scope = { nullValue: null }
      await test('{{ nullValue | concat | join: "," }}', scope, '')
      await test('{{ nullValue | concat: nil | join: "," }}', scope, '')
    })
  })

  describe('push', () => {
    it('should push arg value', async () => {
      const scope = { val: ['hey'], arg: 'foo' }
      await test('{{ val | push: arg | join: "," }}', scope, 'hey,foo')
    })
    it('should not change original array', async () => {
      const scope = { val: ['hey'], arg: 'foo' }
      await test('{{ val | push: arg | join: "," }} {{ val | push: arg | join: "," }}', scope, 'hey,foo hey,foo')
    })
    it('should support undefined left value', async () => {
      const scope = { arg: 'foo' }
      await test('{{ notDefined | push: arg | join: "," }}', scope, 'foo')
    })
    it('should ignore nil left value', async () => {
      const scope = { undefinedValue: undefined, nullValue: null, arg: 'foo' }
      await test('{{ undefinedValue | push: arg | join: "," }}', scope, 'foo')
      await test('{{ nullValue | push: arg | join: "," }}', scope, 'foo')
    })
    it('should support nil right value', async () => {
      const scope = { nullValue: [] }
      await test('{{ nullValue | push | size }}', scope, '1')
      await test('{{ nullValue | push: nil | size }}', scope, '1')
    })
  })

  describe('pop', () => {
    it('should support pop', async () => {
      const scope = { val: ['hey', 'you'] }
      await test('{{ val | pop | join: "," }}', scope, 'hey')
    })
    it('should not change original array', async () => {
      const scope = { val: ['hey', 'you'] }
      await test('{{ val | pop | join: "," }} {{ val| join: "," }}', scope, 'hey hey,you')
    })
    it('should support nil left value', async () => {
      await test('{{ notDefined | pop | join: "," }}', {}, '')
    })
  })

  describe('unshift', () => {
    it('should support unshift', async () => {
      const scope = { val: ['you'] }
      await test('{{ val | unshift: "hey" | join: ", " }}', scope, 'hey, you')
    })
    it('should not change original array', async () => {
      const scope = { val: ['you'] }
      await test('{{ val | unshift: "hey" | join: "," }} {{ val | join: "," }}', scope, 'hey,you you')
    })
    it('should support nil right value', async () => {
      const scope = { val: [] }
      await test('{{ val | unshift: nil | size }}', scope, '1')
    })
  })

  describe('shift', () => {
    it('should support pop', async () => {
      const scope = { val: ['hey', 'you'] }
      await test('{{ val | shift }}', scope, 'you')
    })
    it('should not change original array', async () => {
      const scope = { val: ['hey', 'you'] }
      await test('{{ val | shift }} {{ val | join: ","}}', scope, 'you hey,you')
    })
    it('should support nil left value', async () => {
      await test('{{ notDefined | pop }}', {}, '')
    })
  })

  describe('reverse', function () {
    it('should support reverse', () => test(
      '{{ "Ground control to Major Tom." | split: "" | reverse | join: "" }}',
      '.moT rojaM ot lortnoc dnuorG'
    ))
    it('should be pure', async () => {
      const scope = { arr: ['a', 'b', 'c'] }
      await render('{{ arr | reverse | join: "" }}', scope)
      const html = await render('{{ arr | join: "" }}', scope)
      expect(html).toBe('abc')
    })
  })
  describe('sample', function () {
    it('should return one item if count not specified', async () => {
      const template = '{{ "hello,world" | split: "," | sample }}'
      const result = await engine.parseAndRender(template)
      expect(result).toMatch(/hello|world/)
    })
    it('should return full array sample even if excess count', () => test(
      '{{ "hello,world" | split: "," | sample: 10 | size }}',
      '2'
    ))
    it('should return partial array sample', () => test(
      '{{ "hello,world" | split: "," | sample: 1 | size }}',
      '5'
    ))
    it('should sample nil value', () => test(
      '{{ nil | sample: 2 }}',
      ''
    ))
    it('should sample string characters', () => test(
      '{{ "aaa" | sample: 2 }}',
      'aa'
    ))
  })
  describe('size', function () {
    it('should return string length', () => test(
      '{{ "Ground control to Major Tom." | size }}',
      '28'
    ))
    it('should return array size', () => test(
      '{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}{{ my_array | size }}',
      '4'
    ))
    it('should be respected with <string>.size notation', () => test(
      '{% assign my_string = "Ground control to Major Tom." %}{{ my_string.size }}',
      '28'
    ))
    it('should be respected with <array>.size notation', () => test(
      '{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}{{ my_array.size }}',
      '4'
    ))
    it('should return 0 for false', () => test('{{ false | size }}', '0'))
    it('should return 0 for nil', () => test('{{ nil | size }}', '0'))
    it('should return 0 for undefined', () => test('{{ foo | size }}', '0'))
    it('should work for string', () => test('{{ "foo" | size }}', {}, '3'))
  })
  describe('first', function () {
    it('should support first', () => test(
      '{{arr | first}}',
      { arr: [ 'zebra', 'tiger' ] },
      'zebra'
    ))
    it('should return empty for nil', () => test('{{nil | first}}', ''))
    it('should return empty for undefined', () => test('{{foo | first}}', ''))
    it('should return empty for false', () => test('{{false | first}}', ''))
    it('should work for string', () => test('{{ "foo" | first }}', 'f'))
  })
  describe('last', function () {
    it('should support last', () => test(
      '{{arr | last}}',
      { arr: [ 'zebra', 'tiger' ] },
      'tiger'
    ))
    it('should return empty for nil', () => test('{{nil | last}}', ''))
    it('should return empty for undefined', () => test('{{foo | last}}', ''))
    it('should return empty for false', () => test('{{false | last}}', ''))
    it('should work for string', () => test('{{ "foo" | last }}', {}, 'o'))
  })
  describe('slice', function () {
    it('should slice first char by 0', () => test('{{ "Liquid" | slice: 0 }}', 'L'))
    it('should slice third char by 2', () => test('{{ "Liquid" | slice: 2 }}', 'q'))
    it('should slice substr by 2,5', () => test('{{ "Liquid" | slice: 2, 5 }}', 'quid'))
    it('should slice substr by -3,2', () => test('{{ "Liquid" | slice: -3, 2 }}', 'ui'))
    it('should slice substr by -2,2', () => test('{{ "abc" | slice: -2, 2 }}', 'bc'))
    it('should support array', () => test('{{ "1,2,3,4" | split: "," | slice: 1,2 | join }}', '2 3'))
    it('should return empty array for nil value', () => test('{{ nil | slice: 0 }}', ''))
  })
  describe('sort', function () {
    it('should support sort', function () {
      return test('{% assign my_array = "zebra, octopus, giraffe, Sally Snake"' +
              ' | split: ", " %}' +
              '{{ my_array | sort | join: ", " }}',
      'Sally Snake, giraffe, octopus, zebra')
    })
    it('should support sort by key', function () {
      const tpl = '{{ arr | sort: "name" | map: "name" | join }}'
      const arr = [{ name: 'Bob' }, { name: 'Carol' }, { name: 'Alice' }]
      return test(tpl, { arr }, 'Alice Bob Carol')
    })
    it('should support sort by nested property', function () {
      const tpl = '{{ arr | sort: "name.first" | map: "name.first" | join }}'
      const a = { name: { first: 'Alice' } }
      const b = { name: { first: 'Bob' } }
      const c = { name: { first: 'Carol' } }
      return test(tpl, { arr: [b, c, a, c] }, 'Alice Bob Carol Carol')
    })
    it('should not change the original array', () => {
      const arr = ['one', 'two', 'three', 'four', 'five']
      return test('{{arr | sort}} {{arr}}', { arr }, 'fivefouronethreetwo onetwothreefourfive')
    })
    it('should return empty array for nil value', () => {
      return test('{{notDefined | sort | size}}', {}, '0')
    })
  })
  describe('sort_natural', function () {
    it('should sort alphabetically', () => {
      return test(
        '{% assign my_array = "zebra, octopus, giraffe, Sally Snake" | split: ", " %}{{ my_array | sort_natural | join: ", " }}',
        'giraffe, octopus, Sally Snake, zebra'
      )
    })
    it('should sort with specified property', () => test(
      '{{ students | sort_natural: "name" | map: "name" | join }}',
      { students: [{ name: 'bob' }, { name: 'alice' }, { name: 'carol' }] },
      'alice bob carol'
    ))
    it('should be stable', () => test(
      '{{ students | sort_natural: "age" | map: "name" | join }}',
      { students: [{ name: 'bob', age: 1 }, { name: 'alice', age: 1 }, { name: 'carol', age: 1 }] },
      'bob alice carol'
    ))
    it('should be stable when it comes to undefined props', () => test(
      '{{ students | sort_natural: "age" | map: "name" | join }}',
      { students: [{ name: 'bob' }, { name: 'alice', age: 2 }, { name: 'amber' }, { name: 'watson' }, { name: 'michael' }, { name: 'charlie' }] },
      'alice bob amber watson michael charlie'
    ))
    it('should tolerate undefined props', () => test(
      '{{ students | sort_natural: "age" | map: "name" | join }}',
      { students: [{ name: 'bob' }, { name: 'alice', age: 2 }, { name: 'carol' }] },
      'alice bob carol'
    ))
    it('should tolerate non array', async () => {
      await test(
        '{{ students | sort_natural: "age" | map: "name" | join }}',
        { students: {} },
        ''
      )
      await test(
        '{{ students | sort_natural: "age" | map: "name" | size }}',
        { students: {} },
        '1'
      )
    })
    it('should return empty array for nil value', () => test(
      '{{ students | sort_natural: "age" | map: "name" | size }}',
      { students: undefined },
      '0'
    ))
  })
  describe('uniq', function () {
    it('should uniq string list', function () {
      return test(
        '{% assign my_array = "ants, bugs, bees, bugs, ants" | split: ", " %}' +
        '{{ my_array | uniq | join: ", " }}',
        'ants, bugs, bees'
      )
    })
    it('should uniq falsy value', function () {
      return test('{{"" | uniq | join: ","}}', '')
    })
  })
  describe('where', function () {
    const products = [
      { title: 'Vacuum', type: 'living room' },
      { title: 'Spatula', type: 'kitchen' },
      { title: 'Television', type: 'living room' },
      { title: 'Garlic press', type: 'kitchen' },
      { title: 'Coffee mug', available: true },
      { title: 'Limited edition sneakers', available: false },
      { title: 'Boring sneakers', available: true }
    ]
    it('should support filter by property value', function () {
      return test(`{% assign kitchen_products = products | where: "type", "kitchen" %}
        Kitchen products:
        {% for product in kitchen_products -%}
        - {{ product.title }}
        {% endfor %}`, { products }, `
        Kitchen products:
        - Spatula
        - Garlic press
        `)
    })
    it('should support filter truthy property', function () {
      return test(`{% assign available_products = products | where: "available" %}
        Available products:
        {% for product in available_products -%}
        - {{ product.title }}
        {% endfor %}`, { products }, `
        Available products:
        - Coffee mug
        - Boring sneakers
        `)
    })
    it('should support filter by null property', function () {
      return test(`{% assign untyped_products = products | where: "type", null %}
        Untyped products:
        {% for product in untyped_products -%}
        - {{ product.title }}
        {% endfor %}`, { products }, `
        Untyped products:
        - Coffee mug
        - Limited edition sneakers
        - Boring sneakers
        `)
    })
    it('should support nested property', async function () {
      const authors = [
        { name: 'Alice', books: { year: 2019 } },
        { name: 'Bob', books: { year: 2018 } }
      ]
      return test(
        `{% assign recentAuthors = authors | where: 'books.year', 2019 %}
        Recent Authors:
        {%- for author in recentAuthors %}
          - {{author.name}}
        {%- endfor %}`,
        { authors }, `
        Recent Authors:
          - Alice`)
    })
    it('should apply to string', async () => {
      await test('{{"abc" | where: 1, "b" }}', 'abc')
      await test('{{"abc" | where: 1, "a" }}', '')
    })
    it('should normalize non-array input', async () => {
      const scope = { obj: { foo: 'FOO' } }
      await test('{{obj | where: "foo", "FOO" }}', scope, '[object Object]')
      await test('{{obj | where: "foo", "BAR" }}', scope, '')
    })
    it('should support nested dynamic property', function () {
      const products = [
        { meta: { details: { class: 'A' } }, order: 1 },
        { meta: { details: { class: 'B' } }, order: 2 },
        { meta: { details: { class: 'B' } }, order: 3 }
      ]
      return test(`{% assign selected = products | where: 'meta.details["class"]', exp %}
        {% for item in selected -%}
        - {{ item.order }}
        {% endfor %}`, { products, exp: 'B' }, `
        - 2
        - 3
        `)
    })
    it('should support escape in property', function () {
      const array = [
        { foo: { "'": 'foo' }, order: 1 },
        { foo: { "'": 'foo' }, order: 2 },
        { foo: { "'": 'bar' }, order: 3 }
      ]
      return test(`{% assign selected = array | where: 'foo["\\'"]', "foo" %}
        {% for item in selected -%}
        - {{ item.order }}
        {% endfor %}`, { array }, `
        - 1
        - 2
        `)
    })
    it('should render none if args not specified', function () {
      return test(`{% assign kitchen_products = products | where %}
        Kitchen products:
        {% for product in kitchen_products -%}
        - {{ product.title }}
        {% endfor %}`, { products }, `
        Kitchen products:
        `)
    })
    it('should support nil as target', () => {
      const scope = { list: [{ foo: 'FOO' }, { bar: 'BAR', type: 2 }] }
      return test('{{list | where: "type", nil | json}}', scope, '[{"foo":"FOO"}]')
    })
    it('should support empty as target', async () => {
      const scope = { pages: [{ tags: ['FOO'] }, { tags: [] }, { title: 'foo' }] }
      await test('{{pages | where: "tags", empty | json}}', scope, '[{"tags":[]}]')
    })
    it('should not match string with array', async () => {
      const scope = { objs: [{ foo: ['FOO', 'bar'] }] }
      await test('{{objs | where: "foo", "FOO" | json}}', scope, '[]')
    })
    describe('jekyll style', () => {
      it('should not match string with array', async () => {
        const scope = { objs: [{ foo: ['FOO', 'bar'] }] }
        await test('{{objs | where: "foo", "FOO" | json}}', scope, '[{"foo":["FOO","bar"]}]', { jekyllWhere: true })
      })
      it('should support empty as target', async () => {
        const scope = { pages: [{ tags: ['FOO'] }, { tags: [] }, { title: 'foo' }] }
        await test('{{pages | where: "tags", empty | json}}', scope, '[{"tags":[]}]', { jekyllWhere: true })
      })
    })
    describe('reject', function () {
      it('should support reject by property value', function () {
        return test(`{% assign kitchen_products = products | reject: "type", "kitchen" %}
          Kitchen products:
          {% for product in kitchen_products -%}
          - {{ product.title }}
          {% endfor %}`, { products }, `
          Kitchen products:
          - Vacuum
          - Television
          - Coffee mug
          - Limited edition sneakers
          - Boring sneakers
          `)
      })
      it('should support reject truthy property', function () {
        return test(`{% assign unavailable_products = products | reject: "available" %}
          Unavailable products:
          {% for product in unavailable_products -%}
          - {{ product.title }}
          {% endfor %}`, { products }, `
          Unavailable products:
          - Vacuum
          - Spatula
          - Television
          - Garlic press
          - Limited edition sneakers
          `)
      })
      it('should support reject by string property', function () {
        return test(`{% assign untyped_products = products | reject: "type" %}
          Untyped products:
          {% for product in untyped_products -%}
          - {{ product.title }}
          {% endfor %}`, { products }, `
          Untyped products:
          - Coffee mug
          - Limited edition sneakers
          - Boring sneakers
          `)
      })
    })
  })
  describe('where_exp', function () {
    const products = [
      { title: 'Vacuum', type: 'living room' },
      { title: 'Spatula', type: 'kitchen' },
      { title: 'Television', type: 'living room' },
      { title: 'Garlic press', type: 'kitchen' },
      { title: 'Coffee mug', available: true },
      { title: 'Limited edition sneakers', available: false },
      { title: 'Boring sneakers', available: true }
    ]
    it('should support filter by exp', function () {
      return test(`{% assign kitchen_products = products | where_exp: "item", "item.type == 'kitchen'" %}
        Kitchen products:
        {% for product in kitchen_products -%}
        - {{ product.title }}
        {% endfor %}`, { products }, `
        Kitchen products:
        - Spatula
        - Garlic press
        `)
    })
    it('should be aware context', function () {
      const tpl = `{% assign kitchen_products = products | where_exp: "item", "item.type == target" %}
        Kitchen products:
        {% for product in kitchen_products -%}
        - {{ product.title }}
        {% endfor %}`
      const scope = { products, target: 'kitchen' }
      const html = `
        Kitchen products:
        - Spatula
        - Garlic press
        `
      return test(tpl, scope, html)
    })
    describe('reject_exp', function () {
      it('should support reject by exp', function () {
        return test(`{% assign kitchen_products = products | reject_exp: "item", "item.type != 'kitchen'" %}
          Kitchen products:
          {% for product in kitchen_products -%}
          - {{ product.title }}
          {% endfor %}`, { products }, `
          Kitchen products:
          - Spatula
          - Garlic press
          `)
      })
    })
  })
  describe('group_by', function () {
    const members = [
      { graduation_year: 2003, name: 'Jay' },
      { graduation_year: 2003, name: 'John' },
      { graduation_year: 2004, name: 'Jack' }
    ]
    it('should support group by property', function () {
      const expected = [{
        name: 2003,
        items: [
          { graduation_year: 2003, name: 'Jay' },
          { graduation_year: 2003, name: 'John' }
        ]
      }, {
        name: 2004,
        items: [
          { graduation_year: 2004, name: 'Jack' }
        ]
      }]
      return test(
        `{{ members | group_by: "graduation_year" | json}}`,
        { members },
        JSON.stringify(expected))
    })
  })
  describe('group_by_exp', function () {
    const members = [
      { graduation_year: 2013, name: 'Jay' },
      { graduation_year: 2014, name: 'John' },
      { graduation_year: 2009, name: 'Jack' }
    ]
    const postsByTags = {
      CPP: [ 'page0' ],
      PHP: [ 'page0', 'page2' ],
      JavaScript: [ 'page1', 'page2', 'page3' ],
      CSharp: [ 'page2', 'page4' ]
    }
    it('should support group by expression', function () {
      const expected = [{
        name: '201',
        items: [
          { graduation_year: 2013, name: 'Jay' },
          { graduation_year: 2014, name: 'John' }
        ]
      }, {
        name: '200',
        items: [
          { graduation_year: 2009, name: 'Jack' }
        ]
      }]
      return test(
        `{{ members | group_by_exp: "item", "item.graduation_year | truncate: 3, ''" | json}}`,
        { members },
        JSON.stringify(expected))
    })
    it('should group key/values in plain object', function () {
      const expected = [{
        name: 3,
        items: [
          ['JavaScript', ['page1', 'page2', 'page3']]
        ]
      }, {
        name: 2,
        items: [
          ['PHP', ['page0', 'page2']],
          ['CSharp', ['page2', 'page4']]
        ]
      }, {
        name: 1,
        items: [
          ['CPP', ['page0']]
        ]
      }]
      return test(
        `{{ postsByTags | group_by_exp: "tag", "tag[1].size" | sort: 'name' | reverse | json}}`,
        { postsByTags },
        JSON.stringify(expected))
    })
  })
  describe('has', function () {
    const members = [
      { graduation_year: 2013, name: 'Jay' },
      { graduation_year: 2014, name: 'John' },
      { graduation_year: 2014, name: 'Jack', age: 13 }
    ]
    // it('should support has with no value', function () {
    //   return test(
    //     `{{ members | has: "age" | json }}, {{ members | has: "height" | json }}`,
    //     { members },
    //     `true, false`)
    // })
    it('should support has by property', function () {
      return test(
        `{{ members | has: "graduation_year", 2014 | json }}`,
        { members },
        `true`)
    })
    it('should return false if not found', function () {
      return test(
        `{{ members | has: "graduation_year", 2018 | json }}`,
        { members },
        `false`)
    })
  })
  describe('has_exp', function () {
    const members = [
      { graduation_year: 2013, name: 'Jay' },
      { graduation_year: 2014, name: 'John' },
      { graduation_year: 2014, name: 'Jack' }
    ]
    it('should support has by expression', function () {
      return test(
        `{{ members | has_exp: "item", "item.graduation_year == 2014" | json }}`,
        { members },
        `true`)
    })
    it('should return false if not found', function () {
      return test(
        `{{ members | has_exp: "item", "item.graduation_year == 2018" | json }}`,
        { members },
        `false`)
    })
  })
  describe('find', function () {
    const members = [
      { graduation_year: 2013, name: 'Jay' },
      { graduation_year: 2014, name: 'John' },
      { graduation_year: 2014, name: 'Jack', age: 13 }
    ]
    it('should support find with no value', function () {
      return test(
        `{{ members | find: "age" | json }}`,
        { members },
        `{"graduation_year":2014,"name":"Jack","age":13}`)
    })
    it('should support find by property', function () {
      return test(
        `{{ members | find: "graduation_year", 2014 | json }}`,
        { members },
        `{"graduation_year":2014,"name":"John"}`)
    })
    it('should render none if not found', function () {
      return test(
        `{{ members | find: "graduation_year", 2018 | json }}`,
        { members },
        ``)
    })
    describe('jekyll style', () => {
      it('should not match string with array', async () => {
        const scope = { objs: [{ foo: ['FOO', 'bar'] }] }
        await test('{{objs | find: "foo", "FOO" | json}}', scope, '{"foo":["FOO","bar"]}', { jekyllWhere: true })
      })
      it('should support empty as target', async () => {
        const scope = { pages: [{ tags: ['FOO'] }, { tags: [] }, { title: 'foo' }] }
        await test('{{pages | find: "tags", empty | json}}', scope, '{"tags":[]}', { jekyllWhere: true })
      })
    })
  })
  describe('find_exp', function () {
    const members = [
      { graduation_year: 2013, name: 'Jay' },
      { graduation_year: 2014, name: 'John' },
      { graduation_year: 2014, name: 'Jack' }
    ]
    it('should support find by expression', function () {
      return test(
        `{{ members | find_exp: "item", "item.graduation_year == 2014" | json }}`,
        { members },
        `{"graduation_year":2014,"name":"John"}`)
    })
    it('should render none if not found', function () {
      return test(
        `{{ members | find_exp: "item", "item.graduation_year == 2018" | json }}`,
        { members },
        ``)
    })
  })
  describe('find_index', function () {
    const members = [
      { graduation_year: 2013, name: 'Jay' },
      { graduation_year: 2014, name: 'John' },
      { graduation_year: 2014, name: 'Jack', age: 13 }
    ]
    it('should support find_index with no value', function () {
      return test(
        `{{ members | find_index: "age" | json }}`,
        { members },
        `2`)
    })
    it('should support find_index by property', function () {
      return test(
        `{{ members | find_index: "graduation_year", 2014 | json }}`,
        { members },
        `1`)
    })
    it('should render none if not found', function () {
      return test(
        `{{ members | find_index: "graduation_year", 2018 | json }}`,
        { members },
        ``)
    })
  })
  describe('find_index_exp', function () {
    const members = [
      { graduation_year: 2013, name: 'Jay' },
      { graduation_year: 2014, name: 'John' },
      { graduation_year: 2014, name: 'Jack' }
    ]
    it('should support find_index by expression', function () {
      return test(
        `{{ members | find_index_exp: "item", "item.graduation_year == 2014" | json }}`,
        { members },
        `1`)
    })
    it('should render none if not found', function () {
      return test(
        `{{ members | find_index_exp: "item", "item.graduation_year == 2018" | json }}`,
        { members },
        ``)
    })
  })
  // (TO BE REMOVED)
  describe('RUBY COMPAT', function () {
    const filters = [['where', '| map: "name" | join: ","'], ['reject', '| map: "name" | join: ","'], ['has', '| json'], ['find', '| json'], ['find_index', '| json']]
    const conditions = ['', ', nil', ', blank', ', empty', ', null', ', 3', ', 50', ', 180', ', abc']
    const data = [
      { name: 'Adamy' },
      { name: 'Blake', age: 50 },
      { name: 'Codye', height: 180 }
    ];
    const rubyResults = {
      where: {
        ', nil': 'Blake',
        ', blank': '',
        ', empty': '',
        ', null': 'Blake',
        ', 3': '',
        ', 50': 'Blake',
        ', 180': '',
        ', abc': 'Blake',
        '': 'Blake'
      },
      reject: {
        ', nil': 'Adamy,Codye',
        ', blank': 'Adamy,Blake,Codye',
        ', empty': 'Adamy,Blake,Codye',
        ', null': 'Adamy,Codye',
        ', 3': 'Adamy,Blake,Codye',
        ', 50': 'Adamy,Codye',
        ', 180': 'Adamy,Blake,Codye',
        ', abc': 'Adamy,Codye',
        '': 'Adamy,Codye'
      },
      has: {
        ', nil': 'true',
        ', blank': 'false',
        ', empty': 'false',
        ', null': 'true',
        ', 3': 'false',
        ', 50': 'true',
        ', 180': 'false',
        ', abc': 'true',
        '': 'true'
      },
      find: {
        ', nil': '{"name":"Blake","age":50}',
        ', blank': 'null',
        ', empty': 'null',
        ', null': '{"name":"Blake","age":50}',
        ', 3': 'null',
        ', 50': '{"name":"Blake","age":50}',
        ', 180': 'null',
        ', abc': '{"name":"Blake","age":50}',
        '': '{"name":"Blake","age":50}'
      },
      find_index: {
        ', nil': '1',
        ', blank': '',
        ', empty': '',
        ', null': '1',
        ', 3': '',
        ', 50': '1',
        ', 180': '',
        ', abc': '1',
        '': '1'
      }
    };
    for (const [filter, suffix] of filters) {
      describe(filter, function () {
        for (const condition of conditions) {
          const query = `${filter}: "age"${condition} ${suffix}`
          const expected = rubyResults[filter][condition]
          it(`should match: ${query}`, function () {
            return test(`{{ data | ${query} }}`, { data }, expected)
          })
        }
      })
    }
  })
})
