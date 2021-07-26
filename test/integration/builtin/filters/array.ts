import { test, render } from '../../../stub/render'
import { expect, use } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
use(chaiAsPromised)

describe('filters/array', function () {
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
      return expect(render(src)).to.be.rejectedWith('unexpected token at "\\" and \\"", line:1, col:65')
    })
  })
  it('should support split/last', function () {
    const src = '{% assign my_array = "zebra, octopus, giraffe, tiger" | split: ", " %}' +
      '{{ my_array|last }}'
    return test(src, 'tiger')
  })
  describe('map', () => {
    it('should support map', function () {
      const posts = [{ category: 'foo' }, { category: 'bar' }]
      return test('{{posts | map: "category"}}', { posts }, 'foo,bar')
    })
    it('should normalize non-array input', function () {
      const post = { category: 'foo' }
      return test('{{post | map: "category"}}', { post }, 'foo')
    })
    it('should support nested property', function () {
      const tpl = '{{ arr | map: "name.first" | join }}'
      const a = { name: { first: 'Alice' } }
      const b = { name: { first: 'Bob' } }
      const c = { name: { first: 'Carol' } }
      return test(tpl, { arr: [a, b, c] }, 'Alice Bob Carol')
    })
  })
  describe('compact', () => {
    it('should compact array', function () {
      const posts = [{ category: 'foo' }, { category: 'bar' }, { foo: 'bar' }]
      return test('{{posts | map: "category" | compact}}', { posts }, 'foo,bar')
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
      expect(html).to.equal('abc')
    })
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
    it('should return empty for string', () => test('{{"zebra" | first}}', ''))
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
    it('should return empty for string', () => test('{{"zebra" | last}}', ''))
  })
  describe('slice', function () {
    it('should slice first char by 0', () => test('{{ "Liquid" | slice: 0 }}', 'L'))
    it('should slice third char by 2', () => test('{{ "Liquid" | slice: 2 }}', 'q'))
    it('should slice substr by 2,5', () => test('{{ "Liquid" | slice: 2, 5 }}', 'quid'))
    it('should slice substr by -3,2', () => test('{{ "Liquid" | slice: -3, 2 }}', 'ui'))
    it('should slice substr by -2,2', () => test('{{ "abc" | slice: -2, 2 }}', 'bc'))
    it('should support array', () => test('{{ "1,2,3,4" | split: "," | slice: 1,2 | join }}', '2 3'))
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
  })
})
