import { test } from '../../../stub/render'

describe('filters/html', function () {
  describe('escape', function () {
    it('should escape \' and &', function () {
      return test('{{ "Have you read \'James & the Giant Peach\'?" | escape }}',
        'Have you read &#39;James &amp; the Giant Peach&#39;?')
    })
    it('should escape normal string', function () {
      return test('{{ "Tetsuro Takara" | escape }}', 'Tetsuro Takara')
    })
    it('should escape undefined', function () {
      return test('{{ nonExistent.value | escape }}', '')
    })
  })
  describe('escape_once', function () {
    it('should do escape', () =>
      test('{{ "1 < 2 & 3" | escape_once }}', '1 &lt; 2 &amp; 3'))
    it('should not escape twice',
      () => test('{{ "1 &lt; 2 &amp; 3" | escape_once }}', '1 &lt; 2 &amp; 3'))
  })
  describe('newline_to_br', function () {
    it('should support string_with_newlines', function () {
      const src = '{% capture string_with_newlines %}\n' +
              'Hello\n' +
              'there\n' +
              '{% endcapture %}' +
              '{{ string_with_newlines | newline_to_br }}'
      const dst = '<br />\n' +
              'Hello<br />\n' +
              'there<br />\n'
      return test(src, dst)
    })
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
})
