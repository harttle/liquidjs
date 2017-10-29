const chai = require('chai')
const parse = require('../src/tokenizer.js').parse
const expect = chai.expect

describe('tokenizer', function () {
  describe('parse', function () {
    it('should handle plain HTML', function () {
      var html = '<html><body><p>Lorem Ipsum</p></body></html>'
      var tokens = parse(html)

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
      var html = '<p>{% for p in a[1]%}</p>'
      var tokens = parse(html)

      expect(tokens.length).to.equal(3)
      expect(tokens[1].type).to.equal('tag')
      expect(tokens[1].value).to.equal('for p in a[1]')
    })
    it('should handle value syntax', function () {
      var html = '<p>{{foo | date: "%Y-%m-%d"}}</p>'
      var tokens = parse(html)

      expect(tokens.length).to.equal(3)
      expect(tokens[1].type).to.equal('value')
      expect(tokens[1].value).to.equal('foo | date: "%Y-%m-%d"')
    })
    it('should handle consecutive value and tags', function () {
      var html = '{{foo}}{{bar}}{%foo%}{%bar%}'
      var tokens = parse(html)

      expect(tokens.length).to.equal(4)
      expect(tokens[0].type).to.equal('value')
      expect(tokens[3].type).to.equal('tag')

      expect(tokens[1].value).to.equal('bar')
      expect(tokens[2].value).to.equal('foo')
    })
    it('should keep white spaces and newlines', function () {
      var html = '{%foo%}\n{%bar %}  \n {%alice%}'
      var tokens = parse(html)
      expect(tokens.length).to.equal(5)
      expect(tokens[1].type).to.equal('html')
      expect(tokens[1].raw).to.equal('\n')
      expect(tokens[3].type).to.equal('html')
      expect(tokens[3].raw).to.equal('  \n ')
    })
    it('should handle multiple lines tag', function () {
      var html = '{%foo\na:a\nb:1.23\n%}'
      var tokens = parse(html)
      expect(tokens.length).to.equal(1)
      expect(tokens[0].type).to.equal('tag')
      expect(tokens[0].args).to.equal('a:a\nb:1.23')
      expect(tokens[0].raw).to.equal('{%foo\na:a\nb:1.23\n%}')
    })
    it('should handle multiple lines value', function () {
      var html = '{{foo\n|date:\n"%Y-%m-%d"\n}}'
      var tokens = parse(html)
      expect(tokens.length).to.equal(1)
      expect(tokens[0].type).to.equal('value')
      expect(tokens[0].raw).to.equal('{{foo\n|date:\n"%Y-%m-%d"\n}}')
    })
  })
})
