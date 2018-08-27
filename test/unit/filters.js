import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import Liquid from '../../src/index'

chai.use(chaiAsPromised)
const liquid = new Liquid()
const expect = chai.expect

const ctx = {
  date: new Date(),
  foo: 'bar',
  arr: [-2, 'a'],
  obj: {
    foo: 'bar'
  },
  func: function () {},
  posts: [{
    category: 'foo'
  }, {
    category: 'bar'
  }]
}

function test (src, dst) {
  return expect(liquid.parseAndRender(src, ctx)).to.eventually.equal(dst)
}

describe('filters', function () {
  describe('abs', function () {
    it('should return 3 for -3', () => test('{{ -3 | abs }}', '3'))
    it('should return 2 for arr[0]', () => test('{{ arr[0] | abs }}', '2'))
    it('should return convert string', () => test('{{ "-3" | abs }}', '3'))
  })

  describe('append', function () {
    it('should return "-3abc" for -3, "abc"',
      () => test('{{ -3 | append: "abc" }}', '-3abc'))
    it('should return "abar" for "a",foo', () => test('{{ "a" | append: foo }}', 'abar'))
  })

  it('should support capitalize', () => test('{{ "i am good" | capitalize }}', 'I am good'))

  describe('ceil', function () {
    it('should return "2" for 1.2', () => test('{{ 1.2 | ceil }}', '2'))
    it('should return "2" for 2.0', () => test('{{ 2.0 | ceil }}', '2'))
    it('should return "4" for 3.5', () => test('{{ "3.5" | ceil }}', '4'))
    it('should return "184" for 183.357', () => test('{{ 183.357 | ceil }}', '184'))
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

  describe('date', function () {
    it('should support date: %a %b %d %Y', function () {
      const str = ctx.date.toDateString()
      return test('{{ date | date:"%a %b %d %Y"}}', str)
    })
    it('should create a new Date when given "now"', function () {
      return test('{{ "now" | date: "%Y"}}', (new Date()).getFullYear().toString())
    })
    it('should parse as Date when given UTC string', function () {
      return test('{{ "1991-02-22T00:00:00" | date: "%Y"}}', '1991')
    })
    it('should render string as string if not valid', function () {
      return test('{{ "foo" | date: "%Y"}}', 'foo')
    })
    it('should render object as string if not valid', function () {
      return test('{{ obj | date: "%Y"}}', '{"foo":"bar"}')
    })
  })

  describe('default', function () {
    it('should use default when falsy', () => test('{{false |default: "a"}}', 'a'))
    it('should not use default when truthy', () => test('{{true |default: "a"}}', 'true'))
  })

  describe('divided_by', function () {
    it('should return 2 for 4,2', () => test('{{4 | divided_by: 2}}', '2'))
    it('should return 4 for 16,4', () => test('{{16 | divided_by: 4}}', '4'))
    it('should return 1 for 5,3', () => test('{{5 | divided_by: 3}}', (5 / 3).toString()))
    it('should convert string to number', () => test('{{"6" | divided_by: "3"}}', '2'))
  })

  describe('downcase', function () {
    it('should return "parker moore" for "Parker Moore"',
      () => test('{{ "Parker Moore" | downcase }}', 'parker moore'))
    it('should return "apple" for "apple"',
      () => test('{{ "apple" | downcase }}', 'apple'))
  })

  describe('escape', function () {
    it('should escape \' and &', function () {
      return test('{{ "Have you read \'James & the Giant Peach\'?" | escape }}',
        'Have you read &#39;James &amp; the Giant Peach&#39;?')
    })
    it('should escape normal string', function () {
      return test('{{ "Tetsuro Takara" | escape }}', 'Tetsuro Takara')
    })
    it('should escape function', function () {
      return test('{{ func | escape }}', 'function func() {}')
    })
  })

  describe('escape_once', function () {
    it('should do escape', () =>
      test('{{ "1 < 2 & 3" | escape_once }}', '1 &lt; 2 &amp; 3'))
    it('should not escape twice',
      () => test('{{ "1 &lt; 2 &amp; 3" | escape_once }}', '1 &lt; 2 &amp; 3'))
  })

  it('should support split/first', function () {
    const src = '{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}' +
      '{{ my_array | first }}'
    return test(src, 'apples')
  })

  describe('floor', function () {
    it('should return "1" for 1.2', () => test('{{ 1.2 | floor }}', '1'))
    it('should return "2" for 2.0', () => test('{{ 2.0 | floor }}', '2'))
    it('should return "183" for 183.357', () => test('{{ 183.357 | floor }}', '183'))
    it('should return "3" for 3.5', () => test('{{ "3.5" | floor }}', '3'))
  })

  it('should support join', function () {
    const src = '{% assign beatles = "John, Paul, George, Ringo" | split: ", " %}' +
      '{{ beatles | join: " and " }}'
    return test(src, 'John and Paul and George and Ringo')
  })

  it('should support split/last', function () {
    const src = '{% assign my_array = "zebra, octopus, giraffe, tiger" | split: ", " %}' +
      '{{ my_array|last }}'
    return test(src, 'tiger')
  })

  it('should support lstrip', function () {
    const src = '{{ "          So much room for activities!          " | lstrip }}'
    return test(src, 'So much room for activities!          ')
  })

  it('should support map', function () {
    return test('{{posts | map: "category"}}', '["foo","bar"]')
  })

  describe('minus', function () {
    it('should return "2" for 4,2', () => test('{{ 4 | minus: 2 }}', '2'))
    it('should return "12" for 16,4', () => test('{{ 16 | minus: 4 }}', '12'))
    it('should return "171.357" for 183.357,12',
      () => test('{{ 183.357 | minus: 12 }}', '171.357'))
    it('should convert first arg as number', () => test('{{ "4" | minus: 1 }}', '3'))
    it('should convert both args as number', () => test('{{ "4" | minus: "1" }}', '3'))
  })

  describe('modulo', function () {
    it('should return "1" for 3,2', () => test('{{ 3 | modulo: 2 }}', '1'))
    it('should return "3" for 24,7', () => test('{{ 24 | modulo: 7 }}', '3'))
    it('should return "3.357" for 183.357,12',
      () => test('{{ 183.357 | modulo: 12 }}', '3.357'))
    it('should convert string', () => test('{{ "24" | modulo: "7" }}', '3'))
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

  describe('plus', function () {
    it('should return "6" for 4,2', () => test('{{ 4 | plus: 2 }}', '6'))
    it('should return "20" for 16,4', () => test('{{ 16 | plus: 4 }}', '20'))
    it('should return "195.357" for 183.357,12',
      () => test('{{ 183.357 | plus: 12 }}', '195.357'))
    it('should convert first arg as number', () => test('{{ "4" | plus: 2 }}', '6'))
    it('should convert both args as number', () => test('{{ "4" | plus: "2" }}', '6'))
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

  it('should support reverse', function () {
    return test('{{ "Ground control to Major Tom." | split: "" | reverse | join: "" }}',
      '.moT rojaM ot lortnoc dnuorG')
  })

  describe('round', function () {
    it('should return "1" for 1.2', () => test('{{1.2|round}}', '1'))
    it('should return "3" for 2.7', () => test('{{2.7|round}}', '3'))
    it('should return "183.36" for 183.357,2',
      () => test('{{183.357|round: 2}}', '183.36'))
    it('should convert string to number', () => test('{{"2.7"|round}}', '3'))
  })

  it('should support rstrip', function () {
    return test('{{ "          So much room for activities!          " | rstrip }}',
      '          So much room for activities!')
  })

  describe('size', function () {
    it('should return string length',
      () => test('{{ "Ground control to Major Tom." | size }}', '28'))
    it('should return array size', function () {
      return test('{% assign my_array = "apples, oranges, peaches, plums"' +
                ' | split: ", " %}{{ my_array | size }}',
      '4')
    })
    it('should also be used with dot notation - string',
      () => test('{% assign my_string = "Ground control to Major Tom." %}{{ my_string.size }}', '28'))
    it('should also be used with dot notation - array',
      () => test('{% assign my_array = "apples, oranges, peaches, plums" | split: ", " %}{{ my_array.size }}', '4'))
  })

  describe('slice', function () {
    it('should slice first char by 0', () => test('{{ "Liquid" | slice: 0 }}', 'L'))
    it('should slice third char by 2', () => test('{{ "Liquid" | slice: 2 }}', 'q'))
    it('should slice substr by 2,5', () => test('{{ "Liquid" | slice: 2, 5 }}', 'quid'))
    it('should slice substr by -3,2', () => test('{{ "Liquid" | slice: -3, 2 }}', 'ui'))
  })

  it('should support sort', function () {
    return test('{% assign my_array = "zebra, octopus, giraffe, Sally Snake"' +
            ' | split: ", " %}' +
            '{{ my_array | sort | join: ", " }}',
    'Sally Snake, giraffe, octopus, zebra')
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

  describe('strip_html', function () {
    it('should strip all tags', function () {
      return test('{{ "Have <em>you</em> read <cite><a href=&quot;https://en.wikipedia.org/wiki/Ulysses_(novel)&quot;>Ulysses</a></cite>?" | strip_html }}',
        'Have you read Ulysses?')
    })
    it('should strip all comment tags', function () {
      return test('{{ "<!--Have you read-->Ulysses?" | strip_html }}',
        'Ulysses?')
    })
    it('should strip all style tags and their contents', function () {
      return test('{{ "<style>cite { font-style: italic; }</style><cite>Ulysses<cite>?" | strip_html }}',
        'Ulysses?')
    })
    it('should strip all scripts tags and their contents', function () {
      return test('{{ "<script async>console.log(\'hello world\')</script><cite>Ulysses<cite>?" | strip_html }}',
        'Ulysses?')
    })
    it('should strip until empty', function () {
      return test('{{"<br/><br />< p ></p></ p >" | strip_html }}', '')
    })
  })

  it('should support strip_newlines', function () {
    return test('{% capture string_with_newlines %}\n' +
            'Hello\nthere\n{% endcapture %}' +
            '{{ string_with_newlines | strip_newlines }}',
    'Hellothere')
  })

  describe('times', function () {
    it('should return "6" for 3,2', () => test('{{ 3 | times: 2 }}', '6'))
    it('should return "168" for 24,7', () => test('{{ 24 | times: 7 }}', '168'))
    it('should return "2200.284" for 183.357,12',
      () => test('{{ 183.357 | times: 12 }}', '2200.284'))
    it('should convert string to number', () => test('{{ "24" | times: "7" }}', '168'))
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
    it('should default to 16', function () {
      return test('{{ "1234567890abcdefghi" | truncate }}', '1234567890abc...')
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

  it('should support upcase', () => test('{{ "Parker Moore" | upcase }}', 'PARKER MOORE'))

  describe('url_encode', function () {
    it('should encode @',
      () => test('{{ "john@liquid.com" | url_encode }}', 'john%40liquid.com'))
    it('should encode <space>',
      () => test('{{ "Tetsuro Takara" | url_encode }}', 'Tetsuro%20Takara'))
  })

  describe('obj_test', function () {
    liquid.registerFilter('obj_test', function () {
      return Array.prototype.slice.call(arguments).join(',')
    })
    it('should support object', () => test(`{{ "a" | obj_test: k1: "v1", k2: foo }}`, 'a,k1,v1,k2,bar'))
    it('should support mixed object', () => test(`{{ "a" | obj_test: "something", k1: "v1", k2: foo }}`, 'a,something,k1,v1,k2,bar'))
  })
})
