import { test } from '../../../stub/render'

describe('filters/string', function () {
  describe('append', function () {
    it('should return "-3abc" for -3, "abc"',
      () => test('{{ -3 | append: "abc" }}', '-3abc'))
    it('should return "abar" for "a",foo', () => test('{{ "a" | append: foo }}', 'abar'))
  })
  describe('capitalize', function () {
    it('should capitalize first', () => test('{{ "i am good" | capitalize }}', 'I am good'))
  })
  describe('concat', function () {
    it('should concat arrays', () => test(`
      {%- assign fruits = "apples, oranges, peaches" | split: ", " -%}
      {%- assign vegetables = "carrots, turnips, potatoes" | split: ", " -%}

      {%- assign everything = fruits | concat: vegetables -%}

      {%- for item in everything -%}
      - {{ item }}
      {% endfor -%}`, `- apples
      - oranges
      - peaches
      - carrots
      - turnips
      - potatoes
      `))
    it('should support chained concat', () => test(`
      {%- assign fruits = "apples, oranges, peaches" | split: ", " -%}
      {%- assign vegetables = "carrots, turnips, potatoes" | split: ", " -%}
      {%- assign furniture = "chairs, tables, shelves" | split: ", " -%}
      {%- assign everything = fruits | concat: vegetables | concat: furniture -%}

      {%- for item in everything -%}
      - {{ item }}
      {% endfor -%}`, `- apples
      - oranges
      - peaches
      - carrots
      - turnips
      - potatoes
      - chairs
      - tables
      - shelves
      `))
  })
  describe('downcase', function () {
    it('should return "parker moore" for "Parker Moore"',
      () => test('{{ "Parker Moore" | downcase }}', 'parker moore'))
    it('should return "apple" for "apple"',
      () => test('{{ "apple" | downcase }}', 'apple'))
  })
  describe('split', function () {
    it('should support split/first', function () {
      const src = '{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}' +
        '{{ my_array | first }}'
      return test(src, 'apples')
    })
  })
  it('should support upcase', () => test('{{ "Parker Moore" | upcase }}', 'PARKER MOORE'))
  it('should support lstrip', function () {
    const src = '{{ "          So much room for activities!          " | lstrip }}'
    return test(src, 'So much room for activities!          ')
  })
  it('should support string_with_newlines', function () {
    const src = '{% capture string_with_newlines %}\n' +
            'Hello\n' +
            'there\n' +
            '{% endcapture %}' +
            '{{ string_with_newlines | newline_to_br }}'
    const dst = '<br />' +
            'Hello<br />' +
            'there<br />'
    return test(src, dst)
  })
  it('should support prepend', function () {
    return test('{% assign url = "liquidmarkup.com" %}' +
            '{{ "/index.html" | prepend: url }}',
    'liquidmarkup.com/index.html')
  })
  it('should support remove', function () {
    return test('{{ "I strained to see the train through the rain" | remove: "rain" }}',
      'I sted to see the t through the ')
  })
  it('should support remove_first', function () {
    return test('{{ "I strained to see the train through the rain" | remove_first: "rain" }}',
      'I sted to see the train through the rain')
  })
  it('should support replace', function () {
    return test('{{ "Take my protein pills and put my helmet on" | replace: "my", "your" }}',
      'Take your protein pills and put your helmet on')
  })
  it('should support replace_first', function () {
    return test('{% assign my_string = "Take my protein pills and put my helmet on" %}\n' +
            '{{ my_string | replace_first: "my", "your" }}',
    '\nTake your protein pills and put my helmet on')
  })
  it('should support rstrip', function () {
    return test('{{ "          So much room for activities!          " | rstrip }}',
      '          So much room for activities!')
  })
  it('should support split', function () {
    return test('{% assign beatles = "John, Paul, George, Ringo" | split: ", " %}' +
            '{% for member in beatles %}' +
            '{{ member }} ' +
            '{% endfor %}',
    'John Paul George Ringo ')
  })
  it('should support strip', function () {
    return test('{{ "          So much room for activities!          " | strip }}',
      'So much room for activities!')
  })
  it('should support strip_newlines', function () {
    return test('{% capture string_with_newlines %}\n' +
            'Hello\nthere\n{% endcapture %}' +
            '{{ string_with_newlines | strip_newlines }}',
    'Hellothere')
  })
  describe('truncate', function () {
    it('should truncate when string too long', function () {
      return test('{{ "Ground control to Major Tom." | truncate: 20 }}',
        'Ground control to...')
    })
    it('should not truncate when string not long enough', function () {
      return test('{{ "Ground control to Major Tom." | truncate: 80 }}',
        'Ground control to Major Tom.')
    })
    it('should truncate with custom ellipsis', function () {
      return test('{{ "Ground control to Major Tom." | truncate: 25,", and so on" }}',
        'Ground control, and so on')
    })
    it('should truncate with empty custom ellipsis', function () {
      return test('{{ "Ground control to Major Tom." | truncate: 20, "" }}',
        'Ground control to Ma')
    })
    it('should not truncate when short enough', function () {
      return test('{{ "12345" | truncate: 5 }}', '12345')
    })
    it('should truncate to "..." when len <= 3', function () {
      return test('{{ "12345" | truncate: 2 }}', '...')
    })
    it('should not truncate if length is exactly len', function () {
      return test('{{ "12345" | truncate: 5 }}', '12345')
    })
    it('should default to 50', function () {
      return test('{{ "1234567890123456789012345678901234567890123456789abc" | truncate }}', '12345678901234567890123456789012345678901234567...')
    })
  })
  describe('truncatewords', function () {
    it('should truncate when too many words', function () {
      return test('{{ "Ground control to Major Tom." | truncatewords: 3 }}',
        'Ground control to...')
    })
    it('should not truncate when not enough words', function () {
      return test('{{ "Ground control to Major Tom." | truncatewords: 8 }}',
        'Ground control to Major Tom.')
    })
    it('should truncate with custom ellipsis', function () {
      return test('{{ "Ground control to Major Tom." | truncatewords: 3, "--" }}',
        'Ground control to--')
    })
    it('should truncate with empty custom ellipsis', function () {
      return test('{{ "Ground control to Major Tom." | truncatewords: 3, "" }}',
        'Ground control to')
    })
    it('should allow multiple space chars between', function () {
      return test('{{ "1 \t2  3 \n4" | truncatewords: 3 }}', '1 2 3...')
    })
    it('should show ellipsis if length is exactly len', function () {
      return test('{{ "1 2 3" | truncatewords: 3 }}', '1 2 3...')
    })
    it('should default len to 15', function () {
      return test('{{ "1 2 3 4 5 6 7 8 9 a b c d e f" | truncatewords }}', '1 2 3 4 5 6 7 8 9 a b c d e f...')
    })
  })
})
