import { expect } from 'chai'
import { IdentifierToken } from '../../../src/tokens/identifier-token'
import { NumberToken } from '../../../src/tokens/number-token'
import { PropertyAccessToken } from '../../../src/tokens/property-access-token'
import { RangeToken } from '../../../src/tokens/range-token'
import { OperatorToken } from '../../../src/tokens/operator-token'
import { Tokenizer } from '../../../src/parser/tokenizer'
import { TagToken } from '../../../src/tokens/tag-token'
import { QuotedToken } from '../../../src/tokens/quoted-token'
import { OutputToken } from '../../../src/tokens/output-token'
import { HTMLToken } from '../../../src/tokens/html-token'
import { createTrie } from '../../../src/util/operator-trie'
import { defaultOperators } from '../../../src/types'
import { LiquidTagToken } from '../../../src/tokens/liquid-tag-token'

describe('Tokenizer', function () {
  const trie = createTrie(defaultOperators)

  it('should read quoted', () => {
    expect(new Tokenizer('"foo" ff', trie).readQuoted()!.getText()).to.equal('"foo"')
    expect(new Tokenizer(' "foo"ff', trie).readQuoted()!.getText()).to.equal('"foo"')
  })
  it('should read value', () => {
    expect(new Tokenizer('a[ b][ "c d" ]', trie).readValueOrThrow().getText()).to.equal('a[ b][ "c d" ]')
    expect(new Tokenizer('a.b[c[d.e]]', trie).readValueOrThrow().getText()).to.equal('a.b[c[d.e]]')
  })
  it('should read identifier', () => {
    expect(new Tokenizer('foo bar', trie).readIdentifier()).to.haveOwnProperty('content', 'foo')
    expect(new Tokenizer('foo bar', trie).readWord()).to.haveOwnProperty('content', 'foo')
  })
  it('should read number value', () => {
    const token: NumberToken = new Tokenizer('2.33.2', trie).readValueOrThrow() as any
    expect(token).to.be.instanceOf(NumberToken)
    expect(token.whole.getText()).to.equal('2')
    expect(token.decimal!.getText()).to.equal('33')
    expect(token.getText()).to.equal('2.33')
  })
  it('should read quoted value', () => {
    const value = new Tokenizer('"foo"a', trie).readValue()
    expect(value).to.be.instanceOf(QuotedToken)
    expect(value!.getText()).to.equal('"foo"')
  })
  it('should read property access value', () => {
    expect(new Tokenizer('a[b]["c d"]', trie).readValueOrThrow().getText()).to.equal('a[b]["c d"]')
  })
  it('should read quoted property access value', () => {
    const value = new Tokenizer('["a prop"]', trie).readValue()
    expect(value).to.be.instanceOf(PropertyAccessToken)
    expect((value as PropertyAccessToken).variable.getText()).to.equal('"a prop"')
  })
  it('should throw for broken quoted property access', () => {
    const tokenizer = new Tokenizer('[5]', trie)
    expect(() => tokenizer.readValueOrThrow()).to.throw()
  })
  it('should throw for incomplete quoted property access', () => {
    const tokenizer = new Tokenizer('["a prop"', trie)
    expect(() => tokenizer.readValueOrThrow()).to.throw()
  })
  it('should read hash', () => {
    const hash1 = new Tokenizer('foo: 3', trie).readHash()
    expect(hash1!.name.content).to.equal('foo')
    expect(hash1!.value!.getText()).to.equal('3')

    const hash2 = new Tokenizer(', foo: a[ "bar"]', trie).readHash()
    expect(hash2!.name.content).to.equal('foo')
    expect(hash2!.value!.getText()).to.equal('a[ "bar"]')
  })
  it('should read multiple hashs', () => {
    const hashes = new Tokenizer(', limit: 3 reverse offset:off', trie).readHashes()
    expect(hashes).to.have.lengthOf(3)
    const [limit, reverse, offset] = hashes
    expect(limit.name.content).to.equal('limit')
    expect(limit.value!.getText()).to.equal('3')

    expect(reverse.name.content).to.equal('reverse')
    expect(reverse.value).to.be.undefined

    expect(offset.name.content).to.equal('offset')
    expect(offset.value!.getText()).to.equal('off')
  })
  it('should read hash value with property access', () => {
    const hashes = new Tokenizer('cols: 2, rows: data["rows"]', trie).readHashes()
    expect(hashes).to.have.lengthOf(2)
    const [cols, rols] = hashes

    expect(cols.name.content).to.equal('cols')
    expect(cols.value!.getText()).to.equal('2')

    expect(rols.name.content).to.equal('rows')
    expect(rols.value!.getText()).to.equal('data["rows"]')
  })
  describe('#readTopLevelTokens()', () => {
    it('should read HTML token', function () {
      const html = '<html><body><p>Lorem Ipsum</p></body></html>'
      const tokenizer = new Tokenizer(html, trie)
      const tokens = tokenizer.readTopLevelTokens()

      expect(tokens.length).to.equal(1)
      expect(tokens[0]).instanceOf(HTMLToken)
      expect((tokens[0] as HTMLToken).getContent()).to.equal(html)
    })
    it('should read tag token', function () {
      const html = '<p>{% for p in a[1]%}</p>'
      const tokenizer = new Tokenizer(html, trie)
      const tokens = tokenizer.readTopLevelTokens()

      expect(tokens.length).to.equal(3)
      const tag = tokens[1] as TagToken
      expect(tag).instanceOf(TagToken)
      expect(tag.name).to.equal('for')
      expect(tag.args).to.equal('p in a[1]')
    })
    it('should allow unclosed tag inside {% raw %}', function () {
      const html = '{%raw%} {%if%} {%else {%endraw%}'
      const tokenizer = new Tokenizer(html, trie)
      const tokens = tokenizer.readTopLevelTokens()

      expect(tokens.length).to.equal(3)
      expect(tokens[0]).to.haveOwnProperty('name', 'raw')
      expect((tokens[1] as any).getContent()).to.equal(' {%if%} {%else ')
    })
    it('should allow unclosed endraw tag inside {% raw %}', function () {
      const html = '{%raw%} {%endraw {%raw%} {%endraw%}'
      const tokenizer = new Tokenizer(html, trie)
      const tokens = tokenizer.readTopLevelTokens()

      expect(tokens.length).to.equal(3)
      expect(tokens[0]).to.haveOwnProperty('name', 'raw')
      expect((tokens[1] as any).getContent()).to.equal(' {%endraw {%raw%} ')
    })
    it('should throw when {% raw %} not closed', function () {
      const html = '{%raw%} {%endraw {%raw%}'
      const tokenizer = new Tokenizer(html, trie)
      expect(() => tokenizer.readTopLevelTokens()).to.throw('raw "{%raw%} {%end..." not closed, line:1, col:8')
    })
    it('should read output token', function () {
      const html = '<p>{{foo | date: "%Y-%m-%d"}}</p>'
      const tokenizer = new Tokenizer(html, trie)
      const tokens = tokenizer.readTopLevelTokens()

      expect(tokens.length).to.equal(3)
      const output = tokens[1] as OutputToken
      expect(output).instanceOf(OutputToken)
      expect(output.content).to.equal('foo | date: "%Y-%m-%d"')
    })
    it('should handle consecutive value and tags', function () {
      const html = '{{foo}}{{bar}}{%foo%}{%bar%}'
      const tokenizer = new Tokenizer(html, trie)
      const tokens = tokenizer.readTopLevelTokens()

      expect(tokens.length).to.equal(4)
      const o1 = tokens[0] as OutputToken
      const o2 = tokens[1] as OutputToken
      const t1 = tokens[2] as TagToken
      const t2 = tokens[3] as TagToken
      expect(o1).instanceOf(OutputToken)
      expect(o2).instanceOf(OutputToken)
      expect(t1).instanceOf(TagToken)
      expect(t2).instanceOf(TagToken)

      expect(o1.content).to.equal('foo')
      expect(o2.content).to.equal('bar')
      expect(t1.name).to.equal('foo')
      expect(t1.args).to.equal('')
      expect(t2.name).to.equal('bar')
      expect(t2.args).to.equal('')
    })
    it('should keep white spaces and newlines', function () {
      const html = '{%foo%}\n{%bar %}  \n {%alice%}'
      const tokenizer = new Tokenizer(html, trie)
      const tokens = tokenizer.readTopLevelTokens()
      expect(tokens.length).to.equal(5)
      expect(tokens[1]).instanceOf(HTMLToken)
      expect(tokens[1].getText()).to.equal('\n')
      expect(tokens[3]).instanceOf(HTMLToken)
      expect(tokens[3].getText()).to.equal('  \n ')
    })
    it('should handle multiple lines tag', function () {
      const html = '{%foo\na:a\nb:1.23\n%}'
      const tokenizer = new Tokenizer(html, trie)
      const tokens = tokenizer.readTopLevelTokens()
      expect(tokens.length).to.equal(1)
      expect(tokens[0]).instanceOf(TagToken)
      expect((tokens[0] as TagToken).args).to.equal('a:a\nb:1.23')
      expect(tokens[0].getText()).to.equal('{%foo\na:a\nb:1.23\n%}')
    })
    it('should handle multiple lines value', function () {
      const html = '{{foo\n|date:\n"%Y-%m-%d"\n}}'
      const tokenizer = new Tokenizer(html, trie)
      const tokens = tokenizer.readTopLevelTokens()
      expect(tokens.length).to.equal(1)
      expect(tokens[0]).instanceOf(OutputToken)
      expect(tokens[0].getText()).to.equal('{{foo\n|date:\n"%Y-%m-%d"\n}}')
    })
    it('should handle complex object property access', function () {
      const html = '{{ obj["my:property with anything"] }}'
      const tokenizer = new Tokenizer(html, trie)
      const tokens = tokenizer.readTopLevelTokens()
      expect(tokens.length).to.equal(1)
      const output = tokens[0] as OutputToken
      expect(output).instanceOf(OutputToken)
      expect(output.content).to.equal('obj["my:property with anything"]')
    })
    it('should throw if tag not closed', function () {
      const html = '{% assign foo = bar {{foo}}'
      const tokenizer = new Tokenizer(html, trie)
      expect(() => tokenizer.readTopLevelTokens()).to.throw(/tag "{% assign foo..." not closed/)
    })
    it('should throw if output not closed', function () {
      const tokenizer = new Tokenizer('{{name}', trie)
      expect(() => tokenizer.readTopLevelTokens()).to.throw(/output "{{name}" not closed/)
    })
  })
  describe('#readTagToken()', () => {
    it('should skip quoted delimiters', function () {
      const html = '{% assign a = "%} {% }} {{" %}'
      const tokenizer = new Tokenizer(html, trie)
      const token = tokenizer.readTagToken()

      expect(token).instanceOf(TagToken)
      expect(token.name).to.equal('assign')
      expect(token.args).to.equal('a = "%} {% }} {{"')
    })
  })
  describe('#readOutputToken()', () => {
    it('should skip quoted delimiters', function () {
      const html = '{{ "%} {%" | append: "}} {{" }}'
      const tokenizer = new Tokenizer(html, trie)
      const token = tokenizer.readOutputToken()

      expect(token).instanceOf(OutputToken)
      expect(token.content).to.equal('"%} {%" | append: "}} {{"')
    })
  })
  describe('#readRange()', () => {
    it('should read `(1..3)`', () => {
      const range = new Tokenizer('(1..3)', trie).readRange()
      expect(range).to.be.instanceOf(RangeToken)
      expect(range!.getText()).to.deep.equal('(1..3)')
      const { lhs, rhs } = range!
      expect(lhs).to.be.instanceOf(NumberToken)
      expect(lhs.getText()).to.equal('1')
      expect(rhs).to.be.instanceOf(NumberToken)
      expect(rhs.getText()).to.equal('3')
    })
    it('should throw for `(..3)`', () => {
      expect(() => new Tokenizer('(..3)', trie).readRange()).to.throw('unexpected token "..3)", value expected')
    })
    it('should read `(a.b..c["..d"])`', () => {
      const range = new Tokenizer('(a.b..c["..d"])', trie).readRange()
      expect(range).to.be.instanceOf(RangeToken)
      expect(range!.getText()).to.deep.equal('(a.b..c["..d"])')
    })
  })
  describe('#readFilter()', () => {
    it('should read a simple filter', function () {
      const tokenizer = new Tokenizer('| plus', trie)
      const token = tokenizer.readFilter()
      expect(token).to.have.property('name', 'plus')
      expect(token).to.have.property('args').to.deep.equal([])
    })
    it('should read a filter with argument', function () {
      const tokenizer = new Tokenizer(' | plus: 1', trie)
      const token = tokenizer.readFilter()
      expect(token).to.have.property('name', 'plus')
      expect(token!.args).to.have.lengthOf(1)

      const one: NumberToken = token!.args[0] as any
      expect(one).to.be.instanceOf(NumberToken)
      expect(one.getText()).to.equal('1')
    })
    it('should read a filter with colon but no argument', function () {
      const tokenizer = new Tokenizer('| plus:', trie)
      const token = tokenizer.readFilter()
      expect(token).to.have.property('name', 'plus')
      expect(token).to.have.property('args').to.deep.equal([])
    })
    it('should read null if name not found', function () {
      const tokenizer = new Tokenizer('|', trie)
      const token = tokenizer.readFilter()
      expect(token).to.be.null
    })
    it('should read a filter with k/v argument', function () {
      const tokenizer = new Tokenizer(' | plus: a:1', trie)
      const token = tokenizer.readFilter()
      expect(token).to.have.property('name', 'plus')
      expect(token!.args).to.have.lengthOf(1)

      const [k, v]: [string, NumberToken] = token!.args[0] as any
      expect(k).to.equal('a')
      expect(v).to.be.instanceOf(NumberToken)
      expect(v.getText()).to.equal('1')
    })
    it('should read a filter with "arr[0]" argument', function () {
      const tokenizer = new Tokenizer('| plus: arr[0]', trie)
      const token = tokenizer.readFilter()
      expect(token).to.have.property('name', 'plus')
      expect(token!.args).to.have.lengthOf(1)

      const pa: PropertyAccessToken = token!.args[0] as any
      expect(token!.args[0]).to.be.instanceOf(PropertyAccessToken)
      expect((pa.variable as any).content).to.equal('arr')
      expect(pa.props).to.have.lengthOf(1)
      expect(pa.props[0]).to.be.instanceOf(NumberToken)
      expect(pa.props[0].getText()).to.equal('0')
    })
    it('should read a filter with obj.foo argument', function () {
      const tokenizer = new Tokenizer('| plus: obj.foo', trie)
      const token = tokenizer.readFilter()
      expect(token).to.have.property('name', 'plus')
      expect(token!.args).to.have.lengthOf(1)

      const pa: PropertyAccessToken = token!.args[0] as any
      expect(token!.args[0]).to.be.instanceOf(PropertyAccessToken)
      expect((pa.variable as any).content).to.equal('obj')
      expect(pa.props).to.have.lengthOf(1)
      expect(pa.props[0]).to.be.instanceOf(IdentifierToken)
      expect(pa.props[0].getText()).to.equal('foo')
    })
    it('should read a filter with obj["foo"] argument', function () {
      const tokenizer = new Tokenizer('| plus: obj["good luck"]', trie)
      const token = tokenizer.readFilter()
      expect(token).to.have.property('name', 'plus')
      expect(token!.args).to.have.lengthOf(1)

      const pa: PropertyAccessToken = token!.args[0] as any
      expect(token!.args[0]).to.be.instanceOf(PropertyAccessToken)
      expect(pa.getText()).to.equal('obj["good luck"]')
      expect((pa.variable as any).content).to.equal('obj')
      expect(pa.props[0].getText()).to.equal('"good luck"')
    })
  })
  describe('#readFilters()', () => {
    it('should read simple filters', function () {
      const tokenizer = new Tokenizer('| plus: 3 | capitalize', trie)
      const tokens = tokenizer.readFilters()

      expect(tokens).to.have.lengthOf(2)
      expect(tokens[0]).to.have.property('name', 'plus')
      expect(tokens[0].args).to.have.lengthOf(1)
      expect(tokens[0].args[0]).to.be.instanceOf(NumberToken)
      expect((tokens[0].args[0] as any).getText()).to.equal('3')

      expect(tokens[1]).to.have.property('name', 'capitalize')
      expect(tokens[1].args).to.have.lengthOf(0)
    })
    it('should read filters', function () {
      const tokenizer = new Tokenizer('| plus: a:3 | capitalize | append: foo[a.b["c d"]]', trie)
      const tokens = tokenizer.readFilters()

      expect(tokens).to.have.lengthOf(3)
      expect(tokens[0]).to.have.property('name', 'plus')
      expect(tokens[0].args).to.have.lengthOf(1)
      const [k, v]: [string, NumberToken] = tokens[0].args[0] as any
      expect(k).to.equal('a')
      expect(v).to.be.instanceOf(NumberToken)
      expect(v.getText()).to.equal('3')

      expect(tokens[1]).to.have.property('name', 'capitalize')
      expect(tokens[1].args).to.have.lengthOf(0)

      expect(tokens[2]).to.have.property('name', 'append')
      expect(tokens[2].args).to.have.lengthOf(1)
      expect(tokens[2].args[0]).to.be.instanceOf(PropertyAccessToken)
      expect((tokens[2].args[0] as any).getText()).to.equal('foo[a.b["c d"]]')
      expect((tokens[2].args[0] as any).props[0].getText()).to.equal('a.b["c d"]')
    })
  })
  describe('#readExpression()', () => {
    it('should read expression `a `', () => {
      const exp = [...new Tokenizer('a ', trie).readExpressionTokens()]

      expect(exp).to.have.lengthOf(1)
      expect(exp[0]).to.be.instanceOf(PropertyAccessToken)
      expect(exp[0].getText()).to.deep.equal('a')
    })
    it('should read expression `a[][b]`', () => {
      const exp = [...new Tokenizer('a[][b]', trie).readExpressionTokens()]

      expect(exp).to.have.lengthOf(1)
      const pa = exp[0] as PropertyAccessToken
      expect(pa).to.be.instanceOf(PropertyAccessToken)
      expect((pa.variable as any).content).to.deep.equal('a')
      expect(pa.props).to.have.lengthOf(2)

      const [p1, p2] = pa.props
      expect(p1).to.be.instanceOf(IdentifierToken)
      expect(p1.getText()).to.equal('')
      expect(p2).to.be.instanceOf(PropertyAccessToken)
      expect(p2.getText()).to.equal('b')
    })
    it('should read expression `a.`', () => {
      const exp = [...new Tokenizer('a.', trie).readExpressionTokens()]

      expect(exp).to.have.lengthOf(1)
      const pa = exp[0] as PropertyAccessToken
      expect(pa).to.be.instanceOf(PropertyAccessToken)
      expect((pa.variable as any).content).to.deep.equal('a')
      expect(pa.props).to.have.lengthOf(0)
    })
    it('should read expression `a ==`', () => {
      const exp = [...new Tokenizer('a ==', trie).readExpressionTokens()]

      expect(exp).to.have.lengthOf(1)
      expect(exp[0]).to.be.instanceOf(PropertyAccessToken)
      expect(exp[0].getText()).to.deep.equal('a')
    })
    it('should read expression `a==b`', () => {
      const exp = new Tokenizer('a==b', trie).readExpressionTokens()
      const [a, equals, b] = exp

      expect(a).to.be.instanceOf(PropertyAccessToken)
      expect(a.getText()).to.deep.equal('a')

      expect(equals).to.be.instanceOf(OperatorToken)
      expect(equals.getText()).to.equal('==')

      expect(b).to.be.instanceOf(PropertyAccessToken)
      expect(b.getText()).to.deep.equal('b')
    })
    it('should read expression `^`', () => {
      const exp = new Tokenizer('^', trie).readExpressionTokens()
      expect([...exp]).to.deep.equal([])
    })
    it('should read expression `a == b`', () => {
      const exp = new Tokenizer('a == b', trie).readExpressionTokens()
      const [a, equals, b] = exp

      expect(a).to.be.instanceOf(PropertyAccessToken)
      expect(a.getText()).to.deep.equal('a')

      expect(equals).to.be.instanceOf(OperatorToken)
      expect(equals.getText()).to.equal('==')

      expect(b).to.be.instanceOf(PropertyAccessToken)
      expect(b.getText()).to.deep.equal('b')
    })
    it('should read expression `(1..3) contains 3`', () => {
      const exp = new Tokenizer('(1..3) contains 3', trie).readExpressionTokens()
      const [range, contains, rhs] = exp

      expect(range).to.be.instanceOf(RangeToken)
      expect(range.getText()).to.deep.equal('(1..3)')

      expect(contains).to.be.instanceOf(OperatorToken)
      expect(contains.getText()).to.equal('contains')

      expect(rhs).to.be.instanceOf(NumberToken)
      expect(rhs.getText()).to.deep.equal('3')
    })
    it('should read expression `a[b] == c`', () => {
      const exp = new Tokenizer('a[b] == c', trie).readExpressionTokens()
      const [lhs, contains, rhs] = exp

      expect(lhs).to.be.instanceOf(PropertyAccessToken)
      expect(lhs.getText()).to.deep.equal('a[b]')

      expect(contains).to.be.instanceOf(OperatorToken)
      expect(contains.getText()).to.equal('==')

      expect(rhs).to.be.instanceOf(PropertyAccessToken)
      expect(rhs.getText()).to.deep.equal('c')
    })
    it('should read expression `c[a["b"]] >= c`', () => {
      const exp = new Tokenizer('c[a["b"]] >= c', trie).readExpressionTokens()
      const [lhs, op, rhs] = exp

      expect(lhs).to.be.instanceOf(PropertyAccessToken)
      expect(lhs.getText()).to.deep.equal('c[a["b"]]')

      expect(op).to.be.instanceOf(OperatorToken)
      expect(op.getText()).to.equal('>=')

      expect(rhs).to.be.instanceOf(PropertyAccessToken)
      expect(rhs.getText()).to.deep.equal('c')
    })
    it('should read expression `"][" == var`', () => {
      const exp = new Tokenizer('"][" == var', trie).readExpressionTokens()
      const [lhs, equals, rhs] = exp

      expect(lhs).to.be.instanceOf(QuotedToken)
      expect(lhs.getText()).to.deep.equal('"]["')

      expect(equals).to.be.instanceOf(OperatorToken)
      expect(equals.getText()).to.equal('==')

      expect(rhs).to.be.instanceOf(PropertyAccessToken)
      expect(rhs.getText()).to.deep.equal('var')
    })
    it('should read expression `"\\\'" == "\\""`', () => {
      const exp = new Tokenizer('"\\\'" == "\\""', trie).readExpressionTokens()
      const [lhs, equals, rhs] = exp

      expect(lhs).to.be.instanceOf(QuotedToken)
      expect(lhs.getText()).to.deep.equal('"\\\'"')

      expect(equals).to.be.instanceOf(OperatorToken)
      expect(equals.getText()).to.equal('==')

      expect(rhs).to.be.instanceOf(QuotedToken)
      expect(rhs.getText()).to.deep.equal('"\\""')
    })
  })
  describe('#readLiquidTagTokens', () => {
    it('should read newline terminated tokens', () => {
      const tokenizer = new Tokenizer('echo \'hello\'', trie)
      const tokens = tokenizer.readLiquidTagTokens()
      expect(tokens.length).to.equal(1)
      const tag = tokens[0]
      expect(tag).instanceOf(LiquidTagToken)
      expect(tag.name).to.equal('echo')
      expect(tag.args).to.equal('\'hello\'')
    })
    it('should gracefully handle empty lines', () => {
      const tokenizer = new Tokenizer(`
        echo 'hello'

        decrement foo
        `, trie)
      const tokens = tokenizer.readLiquidTagTokens()
      expect(tokens.length).to.equal(2)
    })
    it('should throw if line does not start with an identifier', () => {
      const tokenizer = new Tokenizer('!', trie)
      expect(() => tokenizer.readLiquidTagTokens()).to.throw(/illegal liquid tag syntax/)
    })
  })
})
