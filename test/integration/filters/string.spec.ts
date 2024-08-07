import { test } from '../../stub/render'
import { Liquid } from '../../../src/liquid'

describe('filters/string', function () {
  const liquid = new Liquid()
  describe('append', function () {
    it('should return "-3abc" for -3, "abc"',
      () => test('{{ -3 | append: "abc" }}', '-3abc'))
    it('should return "abar" for "a", foo', () => test('{{ "a" | append: foo }}', { foo: 'bar' }, 'abar'))
    it('should throw if second argument not set', () => {
      return expect(test('{{ "abc" | append }}', 'abc')).rejects.toThrow(/2 arguments/)
    })
    it('should return "abcfalse" for "abc", false', () => test('{{ "abc" | append: false }}', 'abcfalse'))
  })
  describe('prepend', function () {
    it('should return "-3abc" for -3, "abc"',
      () => test('{{ -3 | prepend: "abc" }}', 'abc-3'))
    it('should return "abar" for "a", foo', () => test('{{ "a" | prepend: foo }}', { foo: 'bar' }, 'bara'))
    it('should throw if second argument not set', () => {
      return expect(test('{{ "abc" | prepend }}', 'abc')).rejects.toThrow(/2 arguments/)
    })
    it('should return "falseabc" for "abc", false', () => test('{{ "abc" | prepend: false }}', 'falseabc'))
  })
  describe('capitalize', function () {
    it('should capitalize first', () => test('{{ "i am good" | capitalize }}', 'I am good'))
    it('should return empty for nil', () => test('{{ nil | capitalize }}', ''))
    it('should return empty for undefined', async () => test('{{ foo | capitalize }}', ''))
    it('should capitalize only first word', async () => test('{{"foo bar" | capitalize}}', 'Foo bar'))
    it('should to lower case if prefixed by spaces', async () => test('{{" foo BaR" | capitalize}}', ' foo bar'))
    it('should to lower case trailing words', async () => test('{{"foo BaR" | capitalize}}', 'Foo bar'))
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
    it('should return "parker moore" for "Parker Moore"', () =>
      test('{{ "Parker Moore" | downcase }}', 'parker moore')
    )
    it('should return "apple" for "apple"', () =>
      test('{{ "apple" | downcase }}', 'apple')
    )
    it('should return empty for undefined', () => test('{{ foo | downcase }}', ''))
  })
  describe('split', function () {
    it('should support split/first', function () {
      const src = '{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}' +
        '{{ my_array | first }}'
      return test(src, 'apples')
    })
  })
  describe('upcase', function () {
    it('should support upcase', () => test('{{ "Parker Moore" | upcase }}', 'PARKER MOORE'))
    it('should return empty for undefined', () => test('{{ foo | upcase }}', ''))
  })
  it('should support lstrip', async () => {
    const src = '{{ "          So much room for activities!          " | lstrip }}'
    await test(src, 'So much room for activities!          ')
    await test('{{ "foobarcoo" | lstrip: "fo" }}', 'barcoo')
  })
  it('should support prepend', function () {
    return test('{% assign url = "liquidmarkup.com" %}' +
            '{{ "/index.html" | prepend: url }}',
    'liquidmarkup.com/index.html')
  })
  describe('remove', function () {
    it('should support remove', () => test(
      '{{ "I strained to see the train through the rain" | remove: "rain" }}',
      'I sted to see the t through the '
    ))
    it('should return empty for undefined', () => test('{{ foo | remove: "rain" }}', ''))
  })
  describe('remove_first', function () {
    it('should support remove_first', () => test('{{ "I strained to see the train through the rain" | remove_first: "rain" }}', 'I sted to see the train through the rain'))
    it('should return empty for undefined', () => test('{{ foo | remove_first: "r" }}', ''))
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
  it('should support rstrip', async () => {
    await test('{{ "          So much room for activities!          " | rstrip }}',
      '          So much room for activities!')
    await test('{{ "foobarcoo" | rstrip: "fco" }}', 'foobar')
  })
  it('should support split', function () {
    return test('{% assign beatles = "John, Paul, George, Ringo" | split: ", " %}' +
            '{% for member in beatles %}' +
            '{{ member }} ' +
            '{% endfor %}',
    'John Paul George Ringo ')
  })
  it('should support strip', async () => {
    await test('{{ "          So much room for activities!          " | strip }}',
      'So much room for activities!')
    await test('{{ "          So much room for activities!          " | strip: "So " }}',
      'much room for activities!')
    await test('{{ "&[]{}" | strip: "&[]{}" }}', '')
  })
  it('should support strip_newlines', function () {
    return test('{% capture string_with_newlines %}\n' +
            'Hello\nthere\n{% endcapture %}' +
            '{{ string_with_newlines | strip_newlines }}',
    'Hellothere')
  })
  it('should support strip_newlines on Windows newlines ', function () {
    return test('{% capture string_with_newlines %}\n' +
            'Hello\r\nthere\n{% endcapture %}' +
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
    it('should truncate to 1 words if less than 1', function () {
      return test('{{ "Ground control to Major Tom." | truncatewords: 0 }}',
        'Ground...')
    })
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
  describe('remove_last', function () {
    it('should remove the last occurrence of substring', function () {
      return test('{{ "I strained to see the train through the rain" | remove_last: "rain" }}',
        'I strained to see the train through the ')
    })
    it('should remove the last occurrence of substring in the middle of a string', function () {
      return test('{{ "I strained to see the train through the rain and fog" | remove_last: "rain" }}',
        'I strained to see the train through the  and fog')
    })
    it('should handle substring not found', function () {
      return test('{{ "I strained to see the train through the rain" | remove_last: "no such thing" }}',
        'I strained to see the train through the rain')
    })
  })
  describe('replace_last', function () {
    it('should replace the last occurrence of substring', function () {
      return test('{{ "Take my protein pills and put my helmet on" | replace_last: "my", "your" }}',
        'Take my protein pills and put your helmet on')
    })
    it('should handle substring not found', function () {
      return test('{{ "Take my protein pills and put my helmet on" | replace_last: "no such thing", "your" }}',
        'Take my protein pills and put my helmet on')
    })
  })
  describe('normalize_whitespace', () => {
    it('should replace " \n " with " "', () => {
      expect(liquid.parseAndRenderSync('{{ "a \n b" | normalize_whitespace }}')).toEqual('a b')
    })
    it('should replace multiple occurrences', () => {
      expect(liquid.parseAndRenderSync('{{ "a \n b  c" | normalize_whitespace }}')).toEqual('a b c')
    })
  })
  describe('number_of_words', () => {
    it('should count words of Latin sentence', async () => {
      const html = await liquid.parseAndRender('{{ "I\'m not hungry" | number_of_words: "auto"}}')
      expect(html).toEqual('3')
    })
    it('should count words of empty sentence', async () => {
      const html = await liquid.parseAndRender('{{ "" | number_of_words }}')
      expect(html).toEqual('0')
    })
    it('should count words of mixed sentence', async () => {
      const html = await liquid.parseAndRender('{{ "Hello world!" | number_of_words }}')
      expect(html).toEqual('2')
    })
    it('should count words of CJK sentence', async () => {
      const html = await liquid.parseAndRender('{{ "你好hello世界world" | number_of_words }}')
      expect(html).toEqual('1')
    })
    it('should count words of Latin sentence in CJK mode', async () => {
      const html = await liquid.parseAndRender('{{ "I\'m not hungry" | number_of_words: "cjk"}}')
      expect(html).toEqual('3')
    })
    it('should count words of empty sentence in CJK mode', async () => {
      const html = await liquid.parseAndRender('{{ "" | number_of_words: "cjk"}}')
      expect(html).toEqual('0')
    })
    it('should count words of CJK sentence with mode "cjk"', async () => {
      const html = await liquid.parseAndRender('{{ "你好hello世界world" | number_of_words: "cjk" }}')
      expect(html).toEqual('6')
    })

    it('should count words of mixed sentence with mode "auto"', async () => {
      const html = await liquid.parseAndRender('{{ "你好hello世界world" | number_of_words: "auto" }}')
      expect(html).toEqual('6')
    })
    it('should count words of CJK sentence with mode "auto"', async () => {
      const html = await liquid.parseAndRender('{{ "你好世界" | number_of_words: "auto" }}')
      expect(html).toEqual('4')
    })
    it('should handle empty input', async () => {
      const html = await liquid.parseAndRender('{{ "" | number_of_words }}')
      expect(html).toEqual('0')
    })

    it('should handle input with only whitespace', async () => {
      const html = await liquid.parseAndRender('{{ "   " | number_of_words }}')
      expect(html).toEqual('0')
    })

    it('should count words with punctuation marks', async () => {
      const html = await liquid.parseAndRender('{{ "Hello! This is a test." | number_of_words }}')
      expect(html).toEqual('5')
    })

    it('should count words with special characters', async () => {
      const html = await liquid.parseAndRender('{{ "This is a test with special characters: !@#$%^&*()-_+=`~[]{};:\'\\"\\|<,>.?/" | number_of_words }}')
      expect(html).toEqual('8')
    })

    it('should count words with multiple spaces between words', async () => {
      const html = await liquid.parseAndRender('{{ "   Hello    world!    " | number_of_words }}')
      expect(html).toEqual('2')
    })

    it('should count words with mixed CJK characters', async () => {
      const html = await liquid.parseAndRender('{{ "你好こんにちは안녕하세요" | number_of_words: "cjk" }}')
      expect(html).toEqual('12')
    })
  })
  describe('array_to_sentence_string', () => {
    it('should handle an empty array', async () => {
      const html = await liquid.parseAndRender('{{ arr | array_to_sentence_string }}', { arr: [] })
      expect(html).toEqual('')
    })

    it('should handle an array with one element', async () => {
      const html = await liquid.parseAndRender('{{ arr | array_to_sentence_string }}', { arr: ['apple'] })
      expect(html).toEqual('apple')
    })

    it('should handle an array with two elements', async () => {
      const html = await liquid.parseAndRender('{{ arr | array_to_sentence_string }}', { arr: ['apple', 'banana'] })
      expect(html).toEqual('apple and banana')
    })

    it('should handle an array with more than two elements', async () => {
      const html = await liquid.parseAndRender('{{ arr | array_to_sentence_string }}', { arr: ['apple', 'banana', 'orange'] })
      expect(html).toEqual('apple, banana, and orange')
    })

    it('should handle an array with custom connector', async () => {
      const html = await liquid.parseAndRender('{{ arr | array_to_sentence_string: "or" }}', { arr: ['apple', 'banana', 'orange'] })
      expect(html).toEqual('apple, banana, or orange')
    })

    it('should handle an array of numbers', async () => {
      const html = await liquid.parseAndRender('{{ arr | array_to_sentence_string }}', { arr: [1, 2, 3] })
      expect(html).toEqual('1, 2, and 3')
    })

    it('should handle an array of mixed types', async () => {
      const html = await liquid.parseAndRender('{{ arr | array_to_sentence_string }}', { arr: ['apple', 2, 'orange'] })
      expect(html).toEqual('apple, 2, and orange')
    })

    it('should handle an array of mixed types', async () => {
      const html = await liquid.parseAndRender('{{ "foo,bar,baz" | split: "," | array_to_sentence_string }}')
      expect(html).toEqual('foo, bar, and baz')
    })
  })
})
