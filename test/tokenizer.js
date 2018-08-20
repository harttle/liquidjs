const chai = require('chai')
const parse = require('../src/tokenizer.js').parse
const expect = chai.expect

describe('tokenizer', function () {
  describe('parse', function () {
    it('should handle plain HTML', function () {
      const html = '<html><body><p>Lorem Ipsum</p></body></html>'
      const tokens = parse(html)

      expect(tokens.length).to.equal(1)
      expect(tokens[0].value).to.equal(html)
      expect(tokens[0].type).to.equal('html')
    })
    it('should throw when non-string passed in', function () {
      expect(function () {
        parse({})
      }).to.throw('illegal input')
    })
    it('should handle tag syntax', function () {
      const html = '<p>{% for p in a[1]%}</p>'
      const tokens = parse(html)

      expect(tokens.length).to.equal(3)
      expect(tokens[1].type).to.equal('tag')
      expect(tokens[1].value).to.equal('for p in a[1]')
    })
    it('should handle value syntax', function () {
      const html = '<p>{{foo | date: "%Y-%m-%d"}}</p>'
      const tokens = parse(html)

      expect(tokens.length).to.equal(3)
      expect(tokens[1].type).to.equal('value')
      expect(tokens[1].value).to.equal('foo | date: "%Y-%m-%d"')
    })
    it('should handle consecutive value and tags', function () {
      const html = '{{foo}}{{bar}}{%foo%}{%bar%}'
      const tokens = parse(html)

      expect(tokens.length).to.equal(4)
      expect(tokens[0].type).to.equal('value')
      expect(tokens[3].type).to.equal('tag')

      expect(tokens[1].value).to.equal('bar')
      expect(tokens[2].value).to.equal('foo')
    })
    it('should keep white spaces and newlines', function () {
      const html = '{%foo%}\n{%bar %}  \n {%alice%}'
      const tokens = parse(html)
      expect(tokens.length).to.equal(5)
      expect(tokens[1].type).to.equal('html')
      expect(tokens[1].raw).to.equal('\n')
      expect(tokens[3].type).to.equal('html')
      expect(tokens[3].raw).to.equal('  \n ')
    })
    it('should handle multiple lines tag', function () {
      const html = '{%foo\na:a\nb:1.23\n%}'
      const tokens = parse(html)
      expect(tokens.length).to.equal(1)
      expect(tokens[0].type).to.equal('tag')
      expect(tokens[0].args).to.equal('a:a\nb:1.23')
      expect(tokens[0].raw).to.equal('{%foo\na:a\nb:1.23\n%}')
    })
    it('should handle multiple lines value', function () {
      const html = '{{foo\n|date:\n"%Y-%m-%d"\n}}'
      const tokens = parse(html)
      expect(tokens.length).to.equal(1)
      expect(tokens[0].type).to.equal('value')
      expect(tokens[0].raw).to.equal('{{foo\n|date:\n"%Y-%m-%d"\n}}')
    })
  })
})
