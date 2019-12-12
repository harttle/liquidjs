import { test } from '../../../stub/render'
import { Liquid } from '../../../../src/liquid'
import { expect } from 'chai'

describe('filters/array', function () {
  let liquid: Liquid
  beforeEach(function () {
    liquid = new Liquid()
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
  })
  it('should support split/last', function () {
    const src = '{% assign my_array = "zebra, octopus, giraffe, tiger" | split: ", " %}' +
      '{{ my_array|last }}'
    return test(src, 'tiger')
  })
  it('should support map', function () {
    return test('{{posts | map: "category"}}', 'foo,bar')
  })
  describe('reverse', function () {
    it('should support reverse', async function () {
      const html = await liquid.parseAndRender('{{ "Ground control to Major Tom." | split: "" | reverse | join: "" }}')
      expect(html).to.equal('.moT rojaM ot lortnoc dnuorG')
    })
    it('should be pure', async function () {
      const scope = { arr: ['a', 'b', 'c'] }
      await liquid.parseAndRender('{{ arr | reverse | join: "" }}', scope)
      const html = await liquid.parseAndRender('{{ arr | join: "" }}', scope)
      expect(html).to.equal('abc')
    })
  })
  describe('size', function () {
    it('should return string length', async () => {
      const html = await liquid.parseAndRender('{{ "Ground control to Major Tom." | size }}')
      expect(html).to.equal('28')
    })
    it('should return array size', async () => {
      const html = await liquid.parseAndRender(
        '{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}{{ my_array | size }}')
      expect(html).to.equal('4')
    })
    it('should be respected with <string>.size notation', async () => {
      const html = await liquid.parseAndRender('{% assign my_string = "Ground control to Major Tom." %}{{ my_string.size }}')
      expect(html).to.equal('28')
    })
    it('should be respected with <array>.size notation', async () => {
      const html = await liquid.parseAndRender('{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}{{ my_array.size }}')
      expect(html).to.equal('4')
    })
    it('should return 0 for false', async () => {
      const html = await liquid.parseAndRender('{{ false | size }}')
      expect(html).to.equal('0')
    })
    it('should return 0 for nil', async () => {
      const html = await liquid.parseAndRender('{{ nil | size }}')
      expect(html).to.equal('0')
    })
    it('should return 0 for undefined', async () => {
      const html = await liquid.parseAndRender('{{ foo | size }}')
      expect(html).to.equal('0')
    })
  })
  describe('first', function () {
    it('should support first', async () => {
      const html = await liquid.parseAndRender(
        '{{arr | first}}',
        { arr: [ 'zebra', 'tiger' ] }
      )
      expect(html).to.equal('zebra')
    })
    it('should return empty for nil', async () => {
      const html = await liquid.parseAndRender('{{nil | first}}')
      expect(html).to.equal('')
    })
    it('should return empty for undefined', async () => {
      const html = await liquid.parseAndRender('{{foo | first}}')
      expect(html).to.equal('')
    })
    it('should return empty for false', async () => {
      const html = await liquid.parseAndRender('{{false | first}}')
      expect(html).to.equal('')
    })
    it('should return empty for string', async () => {
      const html = await liquid.parseAndRender('{{"zebra" | first}}')
      expect(html).to.equal('')
    })
  })
  describe('last', function () {
    it('should support last', async () => {
      const html = await liquid.parseAndRender(
        '{{arr | last}}',
        { arr: [ 'zebra', 'tiger' ] }
      )
      expect(html).to.equal('tiger')
    })
    it('should return empty for nil', async () => {
      const html = await liquid.parseAndRender('{{nil | last}}')
      expect(html).to.equal('')
    })
    it('should return empty for undefined', async () => {
      const html = await liquid.parseAndRender('{{foo | last}}')
      expect(html).to.equal('')
    })
    it('should return empty for false', async () => {
      const html = await liquid.parseAndRender('{{false | last}}')
      expect(html).to.equal('')
    })
    it('should return empty for string', async () => {
      const html = await liquid.parseAndRender('{{"zebra" | last}}')
      expect(html).to.equal('')
    })
  })
  describe('slice', function () {
    it('should slice first char by 0', () => test('{{ "Liquid" | slice: 0 }}', 'L'))
    it('should slice third char by 2', () => test('{{ "Liquid" | slice: 2 }}', 'q'))
    it('should slice substr by 2,5', () => test('{{ "Liquid" | slice: 2, 5 }}', 'quid'))
    it('should slice substr by -3,2', () => test('{{ "Liquid" | slice: -3, 2 }}', 'ui'))
    it('should slice substr by -2,2', () => test('{{ "abc" | slice: -2, 2 }}', 'bc'))
    it('should support array', () => test('{{ "1,2,3,4" | split: "," | slice: 1,2 | join }}', '2 3'))
  })
  it('should support sort', function () {
    return test('{% assign my_array = "zebra, octopus, giraffe, Sally Snake"' +
            ' | split: ", " %}' +
            '{{ my_array | sort | join: ", " }}',
    'Sally Snake, giraffe, octopus, zebra')
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
    it('should support filter by property value', function () {
      return test(`{% assign kitchen_products = products | where: "type", "kitchen" %}
Kitchen products:
{% for product in kitchen_products -%}
- {{ product.title }}
{% endfor %}`, `
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
{% endfor %}`, `
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
      const html = await liquid.parseAndRender(
        `{% assign recentAuthors = authors | where: 'books.year', 2019 %}
Recent Authors:
{%- for author in recentAuthors %}
  - {{author.name}}
{%- endfor %}`,
        { authors }
      )
      expect(html).to.equal(`
Recent Authors:
  - Alice`)
    })
  })
})
