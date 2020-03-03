import { expect } from 'chai'
import { Tokenizer } from '../../../src/parser/tokenizer'
import { TagToken } from '../../../src/parser/tag-token'
import { OutputToken } from '../../../src/parser/output-token'
import { HTMLToken } from '../../../src/parser/html-token'

describe('Tokenize', function () {
  it('should read quoted', () => {
    expect(new Tokenizer('"foo" ff').readQuoted()).to.equal('"foo"')
    expect(new Tokenizer(' "foo"ff').readQuoted()).to.equal('"foo"')
  })
  it('should read property access', () => {
    expect(new Tokenizer('a[ b][ "c d" ]').readPropertyAccess()).to.equal('a[b]["c d"]')
    expect(new Tokenizer('a.b[c[d.e]]').readPropertyAccess()).to.equal('a.b[c[d.e]]')
  })
  it('should read value', () => {
    expect(new Tokenizer('2.33.2').readValue()).to.equal('2.33.2')
    expect(new Tokenizer('"foo"a').readValue()).to.equal('"foo"')
    expect(new Tokenizer('a[b]["c d"]').readValue()).to.equal('a[b]["c d"]')
  })
  it('should read hash', () => {
    expect(new Tokenizer('foo: 3').readHash()).to.deep.equal(['foo', '3'])
    expect(new Tokenizer(', foo: a[ "bar"]').readHash()).to.deep.equal(['foo', 'a["bar"]'])
  })
  it('should read hashs', () => {
    expect(new Tokenizer(', limit: 3 reverse offset:off').readHashes())
      .to.deep.equal([['limit', '3'], ['reverse', ''], ['offset', 'off']])
    expect(new Tokenizer('cols: 2, rows: data["rows"]').readHashes())
      .to.deep.equal([['cols', '2'], ['rows', 'data["rows"]']])
  })
  it('should read HTML token', function () {
    const html = '<html><body><p>Lorem Ipsum</p></body></html>'
    const tokenizer = new Tokenizer(html)
    const tokens = tokenizer.readTokens()

    expect(tokens.length).to.equal(1)
    expect(tokens[0].content).to.equal(html)
    expect(tokens[0]).instanceOf(HTMLToken)
  })
  it('should read tag token', function () {
    const html = '<p>{% for p in a[1]%}</p>'
    const tokenizer = new Tokenizer(html)
    const tokens = tokenizer.readTokens()

    expect(tokens.length).to.equal(3)
    expect(tokens[1]).instanceOf(TagToken)
    expect(tokens[1].content).to.equal('for p in a[1]')
  })
  it('should read value token', function () {
    const html = '<p>{{foo | date: "%Y-%m-%d"}}</p>'
    const tokenizer = new Tokenizer(html)
    const tokens = tokenizer.readTokens()

    expect(tokens.length).to.equal(3)
    expect(tokens[1]).instanceOf(OutputToken)
    expect(tokens[1].content).to.equal('foo | date: "%Y-%m-%d"')
  })
  it('should handle consecutive value and tags', function () {
    const html = '{{foo}}{{bar}}{%foo%}{%bar%}'
    const tokenizer = new Tokenizer(html)
    const tokens = tokenizer.readTokens()

    expect(tokens.length).to.equal(4)
    expect(tokens[0]).instanceOf(OutputToken)
    expect(tokens[2]).instanceOf(TagToken)

    expect(tokens[1].content).to.equal('bar')
    expect(tokens[2].content).to.equal('foo')
  })
  it('should keep white spaces and newlines', function () {
    const html = '{%foo%}\n{%bar %}  \n {%alice%}'
    const tokenizer = new Tokenizer(html)
    const tokens = tokenizer.readTokens()
    expect(tokens.length).to.equal(5)
    expect(tokens[1]).instanceOf(HTMLToken)
    expect(tokens[1].raw).to.equal('\n')
    expect(tokens[3]).instanceOf(HTMLToken)
    expect(tokens[3].raw).to.equal('  \n ')
  })
  it('should handle multiple lines tag', function () {
    const html = '{%foo\na:a\nb:1.23\n%}'
    const tokenizer = new Tokenizer(html)
    const tokens = tokenizer.readTokens()
    expect(tokens.length).to.equal(1)
    expect(tokens[0]).instanceOf(TagToken)
    expect((tokens[0] as TagToken).args).to.equal('a:a\nb:1.23')
    expect(tokens[0].raw).to.equal('{%foo\na:a\nb:1.23\n%}')
  })
  it('should handle multiple lines value', function () {
    const html = '{{foo\n|date:\n"%Y-%m-%d"\n}}'
    const tokenizer = new Tokenizer(html)
    const tokens = tokenizer.readTokens()
    expect(tokens.length).to.equal(1)
    expect(tokens[0]).instanceOf(OutputToken)
    expect(tokens[0].raw).to.equal('{{foo\n|date:\n"%Y-%m-%d"\n}}')
  })
  it('should handle complex object property access', function () {
    const html = '{{ obj["my:property with anything"] }}'
    const tokenizer = new Tokenizer(html)
    const tokens = tokenizer.readTokens()
    expect(tokens.length).to.equal(1)
    expect(tokens[0]).instanceOf(OutputToken)
    expect(tokens[0].content).to.equal('obj["my:property with anything"]')
  })
  it('should throw if tag not closed', function () {
    const html = '{% assign foo = bar {{foo}}'
    const tokenizer = new Tokenizer(html)
    expect(() => tokenizer.readTokens()).to.throw(/tag "{% assign foo..." not closed/)
  })
  it('should throw if output not closed', function () {
    const tokenizer = new Tokenizer('{{name}')
    expect(() => tokenizer.readTokens()).to.throw(/output "{{name}" not closed/)
  })
  it('should read a simple filter', function () {
    const tokenizer = new Tokenizer('| plus')
    const token = tokenizer.readFilterToken()
    expect(token).to.have.property('name', 'plus')
    expect(token).to.have.property('args').to.deep.equal([])
  })
  it('should read a filter with argument', function () {
    const tokenizer = new Tokenizer(' | plus: 1')
    const token = tokenizer.readFilterToken()
    expect(token).to.have.property('name', 'plus')
    expect(token).to.have.property('args').to.deep.equal(['1'])
  })
  it('should read a filter with colon but no argument', function () {
    const tokenizer = new Tokenizer('| plus:')
    const token = tokenizer.readFilterToken()
    expect(token).to.have.property('name', 'plus')
    expect(token).to.have.property('args').to.deep.equal([])
  })
  it('should read a filter with k/v argument', function () {
    const tokenizer = new Tokenizer(' | plus: a:1')
    const token = tokenizer.readFilterToken()
    expect(token).to.have.property('name', 'plus')
    expect(token).to.have.property('args').to.deep.equal([['a', '1']])
  })
  it('should read a filter with "arr[0]" argument', function () {
    const tokenizer = new Tokenizer('| plus: arr[0]')
    const token = tokenizer.readFilterToken()
    expect(token).to.have.property('name', 'plus')
    expect(token).to.have.property('args').to.deep.equal(['arr[0]'])
  })
  it('should read a filter with obj.foo argument', function () {
    const tokenizer = new Tokenizer('| plus: obj.foo')
    const token = tokenizer.readFilterToken()
    expect(token).to.have.property('name', 'plus')
    expect(token).to.have.property('args').to.deep.equal(['obj.foo'])
  })
  it('should read a filter with obj["foo"] argument', function () {
    const tokenizer = new Tokenizer('| plus: obj["good luck"]')
    const token = tokenizer.readFilterToken()
    expect(token).to.have.property('name', 'plus')
    expect(token).to.have.property('args').to.deep.equal(['obj["good luck"]'])
  })
  it('should read simple filters', function () {
    const tokenizer = new Tokenizer('| plus: 3 | capitalize')
    const tokens = tokenizer.readFilterTokens()

    expect(tokens).to.have.lengthOf(2)
    expect(tokens[0]).to.have.property('name', 'plus')
    expect(tokens[0]).to.have.property('args').to.deep.equal(['3'])
    expect(tokens[1]).to.have.property('name', 'capitalize')
    expect(tokens[1]).to.have.property('args').to.deep.equal([])
  })
  it('should read filters', function () {
    const tokenizer = new Tokenizer('| plus: 3 | capitalize | append: foo[a.b["c d"]]')
    const tokens = tokenizer.readFilterTokens()

    expect(tokens).to.have.lengthOf(3)
    expect(tokens[0]).to.have.property('name', 'plus')
    expect(tokens[0]).to.have.property('args').to.deep.equal(['3'])
    expect(tokens[1]).to.have.property('name', 'capitalize')
    expect(tokens[1]).to.have.property('args').to.deep.equal([])
    expect(tokens[2]).to.have.property('name', 'append')
    expect(tokens[2]).to.have.property('args').to.deep.equal(['foo[a.b["c d"]]'])
  })
  it('should read expression `a==b`', () => {
    const exp = new Tokenizer('a==b').readExpression()
    expect([...exp]).to.deep.equal(['a', '==', 'b'])
  })
  it('should read expression `^`', () => {
    const exp = new Tokenizer('^').readExpression()
    expect([...exp]).to.deep.equal([])
  })
  it('should read expression `a == b`', () => {
    const exp = new Tokenizer('a == b').readExpression()
    expect([...exp]).to.deep.equal(['a', '==', 'b'])
  })
  it('should read expression `(1..3) contains 3`', () => {
    const exp = new Tokenizer('(1..3) contains 3').readExpression()
    expect([...exp]).to.deep.equal(['(1..3)', 'contains', '3'])
  })
  it('should read expression `a[b] = c`', () => {
    const exp = new Tokenizer('a[b] = c').readExpression()
    expect([...exp]).to.deep.equal(['a[b]', '=', 'c'])
  })
  it('should read expression `c[a["b"]] >= c`', () => {
    const exp = new Tokenizer('c[a["b"]] >= c').readExpression()
    expect([...exp]).to.deep.equal(['c[a["b"]]', '>=', 'c'])
  })
  it('should read expression `"][" == var`', () => {
    const exp = new Tokenizer('"][" == var').readExpression()
    expect([...exp]).to.deep.equal(['"]["', '==', 'var'])
  })
  it('should read expression `"\\\'" == "\\""`', () => {
    const exp = new Tokenizer('"\\\'" == "\\""').readExpression()
    expect([...exp]).to.deep.equal(['"\\\'"', '==', '"\\""'])
  })
})
