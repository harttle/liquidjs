const chai = require('chai')
const parse = require('../src/tokenizer.js').parse
const whiteSpaceCtrl = require('../src/tokenizer.js').whiteSpaceCtrl
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
      }).to.throw('illegal input type')
    })
    it('should handle tag syntax', function () {
      var html = '<p>{% for p in a[1]%}</p>'
      var tokens = parse(html)

      expect(tokens.length).to.equal(3)
      expect(tokens[1].type).to.equal('tag')
      expect(tokens[1].value).to.equal('for p in a[1]')
    })
    it('should handle output syntax', function () {
      var html = '<p>{{foo | date: "%Y-%m-%d"}}</p>'
      var tokens = parse(html)

      expect(tokens.length).to.equal(3)
      expect(tokens[1].type).to.equal('output')
      expect(tokens[1].value).to.equal('foo | date: "%Y-%m-%d"')
    })
    it('should handle successive outputs and tags', function () {
      var html = '{{foo}}{{bar}}{%foo%}{%bar%}'
      var tokens = parse(html)

      expect(tokens.length).to.equal(4)
      expect(tokens[0].type).to.equal('output')
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
    it('should handle multiple lines output', function () {
      var html = '{{foo\n|date:\n"%Y-%m-%d"\n}}'
      var tokens = parse(html)
      expect(tokens.length).to.equal(1)
      expect(tokens[0].type).to.equal('output')
      expect(tokens[0].raw).to.equal('{{foo\n|date:\n"%Y-%m-%d"\n}}')
    })
  })
  describe('whitespace control', function () {
    it('should not strip by default', function () {
      expect(whiteSpaceCtrl('\n {%foo%} \n')).to.equal('\n {%foo%} \n')
    })
    it('should strip all blank characters before and after', function () {
      expect(whiteSpaceCtrl(' \t\r{%-foo-%} \t\n')).to.equal('{%-foo-%}')
    })
    it('should not trim previous/next lines', function () {
      expect(whiteSpaceCtrl(' \t\n {%-foo-%}')).to.equal(' \t\n{%-foo-%}')
      expect(whiteSpaceCtrl('{%-foo-%} \n \tfoo')).to.equal('{%-foo-%} \tfoo')
    })
    it('should trim exactly one trailing CR', function () {
      expect(whiteSpaceCtrl('{%-foo-%} \n\n')).to.equal('{%-foo-%}\n')
    })
    it('should trim all leading/trailing blanks when options.greedy set', function () {
      expect(whiteSpaceCtrl(' \n \n\t\r{%-foo-%}\n \n', {
        greedy: true
      })).to.equal('{%-foo-%}')
    })
    it('should strip whitespaces when set trim_left', function () {
      expect(whiteSpaceCtrl('\n  {%foo%} \n', {
        trim_left: true
      })).to.equal('\n{%-foo%} \n')
    })
    it('should strip whitespaces when set trim_right', function () {
      expect(whiteSpaceCtrl('\n  {%foo%} \n', {
        trim_right: true
      })).to.equal('\n  {%foo-%}')
    })
    it('markup should has priority over options', function () {
      expect(whiteSpaceCtrl('\n  {%-foo%} \n', {
        trim_left: false
      })).to.equal('\n{%-foo%} \n')
    })
    it('should support a mix of markup and options', function () {
      expect(whiteSpaceCtrl('  {%-foo%} \n', {
        trim_left: true,
        trim_right: true
      })).to.equal('{%-foo-%}')
    })
  })
})
