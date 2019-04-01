import { test } from '../../../stub/render'

describe('filters/array', function () {
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
  it('should support reverse', function () {
    return test('{{ "Ground control to Major Tom." | split: "" | reverse | join: "" }}',
      '.moT rojaM ot lortnoc dnuorG')
  })
  describe('size', function () {
    it('should return string length',
      () => test('{{ "Ground control to Major Tom." | size }}', '28'))
    it('should return array size', function () {
      return test('{% assign my_array = "apples, oranges, peaches, plums"' +
                ' | split: ", " %}{{ my_array | size }}',
      '4')
    })
    it('should be respected with <string>.size notation',
      () => test('{% assign my_string = "Ground control to Major Tom." %}{{ my_string.size }}', '28'))
    it('should be respected with <array>.size notation',
      () => test('{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}{{ my_array.size }}', '4'))
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
  })
})
