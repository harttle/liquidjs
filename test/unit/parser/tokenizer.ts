import { expect } from 'chai'
import Tokenizer from '../../../src/parser/tokenizer'
import TagToken from '../../../src/parser/tag-token'
import OutputToken from '../../../src/parser/output-token'
import HTMLToken from '../../../src/parser/html-token'

describe('tokenizer', function () {
  const tokenizer = new Tokenizer()
  describe('#tokenize()', function () {
    it('should handle plain HTML', function () {
      const html = '<html><body><p>Lorem Ipsum</p></body></html>'
      const tokens = tokenizer.tokenize(html)

      expect(tokens.length).to.equal(1)
      expect(tokens[0].value).to.equal(html)
      expect(tokens[0]).instanceOf(HTMLToken)
    })
    it('should handle tag syntax', function () {
      const html = '<p>{% for p in a[1]%}</p>'
      const tokens = tokenizer.tokenize(html)

      expect(tokens.length).to.equal(3)
      expect(tokens[1]).instanceOf(TagToken)
      expect(tokens[1].value).to.equal('for p in a[1]')
    })
    it('should handle value syntax', function () {
      const html = '<p>{{foo | date: "%Y-%m-%d"}}</p>'
      const tokens = tokenizer.tokenize(html)

      expect(tokens.length).to.equal(3)
      expect(tokens[1]).instanceOf(OutputToken)
      expect(tokens[1].value).to.equal('foo | date: "%Y-%m-%d"')
    })
    it('should handle consecutive value and tags', function () {
      const html = '{{foo}}{{bar}}{%foo%}{%bar%}'
      const tokens = tokenizer.tokenize(html)

      expect(tokens.length).to.equal(4)
      expect(tokens[0]).instanceOf(OutputToken)
      expect(tokens[2]).instanceOf(TagToken)

      expect(tokens[1].value).to.equal('bar')
      expect(tokens[2].value).to.equal('foo')
    })
    it('should keep white spaces and newlines', function () {
      const html = '{%foo%}\n{%bar %}  \n {%alice%}'
      const tokens = tokenizer.tokenize(html)
      expect(tokens.length).to.equal(5)
      expect(tokens[1]).instanceOf(HTMLToken)
      expect(tokens[1].raw).to.equal('\n')
      expect(tokens[3]).instanceOf(HTMLToken)
      expect(tokens[3].raw).to.equal('  \n ')
    })
    it('should handle multiple lines tag', function () {
      const html = '{%foo\na:a\nb:1.23\n%}'
      const tokens = tokenizer.tokenize(html)
      expect(tokens.length).to.equal(1)
      expect(tokens[0]).instanceOf(TagToken)
      expect((tokens[0] as TagToken).args).to.equal('a:a\nb:1.23')
      expect(tokens[0].raw).to.equal('{%foo\na:a\nb:1.23\n%}')
    })
    it('should handle multiple lines value', function () {
      const html = '{{foo\n|date:\n"%Y-%m-%d"\n}}'
      const tokens = tokenizer.tokenize(html)
      expect(tokens.length).to.equal(1)
      expect(tokens[0]).instanceOf(OutputToken)
      expect(tokens[0].raw).to.equal('{{foo\n|date:\n"%Y-%m-%d"\n}}')
    })
    it('should throw if tag not closed', function () {
      expect(() => {
        tokenizer.tokenize('{% assign foo = bar {{foo}}')
      }).to.throw(/tag "{% assign foo..." not closed/)
    })
    it('should throw if output not closed', function () {
      expect(() => {
        tokenizer.tokenize('{{name}')
      }).to.throw(/output "{{name}" not closed/)
    })
  })
})
