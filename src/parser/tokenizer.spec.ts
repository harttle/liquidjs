import { LiquidTagToken, HTMLToken, QuotedToken, OutputToken, TagToken, OperatorToken, RangeToken, PropertyAccessToken, NumberToken, IdentifierToken } from '../tokens'
import { Tokenizer } from './tokenizer'
import { defaultOperators } from '../render/operator'
import { createTrie } from '../util/operator-trie'

describe('Tokenizer', function () {
  it('should read quoted', () => {
    expect(new Tokenizer('"foo" ff').readQuoted()!.getText()).toBe('"foo"')
    expect(new Tokenizer(' "foo"ff').readQuoted()!.getText()).toBe('"foo"')
  })
  it('should read value', () => {
    expect(new Tokenizer('a[ b][ "c d" ]').readValueOrThrow().getText()).toBe('a[ b][ "c d" ]')
    expect(new Tokenizer('a.b[c[d.e]]').readValueOrThrow().getText()).toBe('a.b[c[d.e]]')
  })
  it('should read identifier', () => {
    expect(new Tokenizer('foo bar').readIdentifier()).toHaveProperty('content', 'foo')
    // eslint-disable-next-line deprecation/deprecation
    expect(new Tokenizer('foo bar').readWord()).toHaveProperty('content', 'foo')
  })
  it('should read integer number', () => {
    const token: NumberToken = new Tokenizer('123').readValueOrThrow() as any
    expect(token).toBeInstanceOf(NumberToken)
    expect(token.getText()).toBe('123')
    expect(token.content).toBe(123)
  })
  it('should read negative number', () => {
    const token: NumberToken = new Tokenizer('-123').readValueOrThrow() as any
    expect(token).toBeInstanceOf(NumberToken)
    expect(token.getText()).toBe('-123')
    expect(token.content).toBe(-123)
  })
  it('should read float number', () => {
    const token: NumberToken = new Tokenizer('1.23').readValueOrThrow() as any
    expect(token).toBeInstanceOf(NumberToken)
    expect(token.getText()).toBe('1.23')
    expect(token.content).toBe(1.23)
  })
  it('should treat 1.2.3 as property read', () => {
    const token: PropertyAccessToken = new Tokenizer('1.2.3').readValueOrThrow() as any
    expect(token).toBeInstanceOf(PropertyAccessToken)
    expect(token.props).toHaveLength(3)
    expect(token.props[0].getText()).toBe('1')
    expect(token.props[1].getText()).toBe('2')
    expect(token.props[2].getText()).toBe('3')
  })
  it('should read quoted value', () => {
    const value = new Tokenizer('"foo"a').readValue()
    expect(value).toBeInstanceOf(QuotedToken)
    expect(value!.getText()).toBe('"foo"')
  })
  it('should read property access value', () => {
    expect(new Tokenizer('a[b]["c d"]').readValueOrThrow().getText()).toBe('a[b]["c d"]')
  })
  it('should read quoted property access value', () => {
    const value = new Tokenizer('["a prop"]').readValue()
    expect(value).toBeInstanceOf(PropertyAccessToken)
    expect((value as QuotedToken).getText()).toBe('["a prop"]')
  })
  it('should throw for incomplete quoted property access', () => {
    const tokenizer = new Tokenizer('["a prop"')
    expect(() => tokenizer.readValueOrThrow()).toThrow()
  })
  it('should read hash', () => {
    const hash1 = new Tokenizer('foo: 3').readHash()
    expect(hash1!.name.content).toBe('foo')
    expect(hash1!.value!.getText()).toBe('3')

    const hash2 = new Tokenizer(', foo: a[ "bar"]').readHash()
    expect(hash2!.name.content).toBe('foo')
    expect(hash2!.value!.getText()).toBe('a[ "bar"]')
  })
  it('should read multiple hashes', () => {
    const hashes = new Tokenizer(', limit: 3 reverse offset:off').readHashes()
    expect(hashes).toHaveLength(3)
    const [limit, reverse, offset] = hashes
    expect(limit.name.content).toBe('limit')
    expect(limit.value!.getText()).toBe('3')

    expect(reverse.name.content).toBe('reverse')
    expect(reverse.value).toBeUndefined()

    expect(offset.name.content).toBe('offset')
    expect(offset.value!.getText()).toBe('off')
  })
  it('should read hash value with property access', () => {
    const hashes = new Tokenizer('cols: 2, rows: data["rows"]').readHashes()
    expect(hashes).toHaveLength(2)
    const [cols, rols] = hashes

    expect(cols.name.content).toBe('cols')
    expect(cols.value!.getText()).toBe('2')

    expect(rols.name.content).toBe('rows')
    expect(rols.value!.getText()).toBe('data["rows"]')
  })
  describe('#readTopLevelTokens()', () => {
    it('should read HTML token', function () {
      const html = '<html><body><p>Lorem Ipsum</p></body></html>'
      const tokenizer = new Tokenizer(html)
      const tokens = tokenizer.readTopLevelTokens()

      expect(tokens.length).toBe(1)
      expect(tokens[0]).toBeInstanceOf(HTMLToken)
      expect((tokens[0] as HTMLToken).getContent()).toBe(html)
    })
    it('should read tag token', function () {
      const html = '<p>{% for p in a[1]%}</p>'
      const tokenizer = new Tokenizer(html)
      const tokens = tokenizer.readTopLevelTokens()

      expect(tokens.length).toBe(3)
      const tag = tokens[1] as TagToken
      expect(tag).toBeInstanceOf(TagToken)
      expect(tag.name).toBe('for')
      expect(tag.args).toBe('p in a[1]')
    })
    it('should allow unclosed tag inside {% raw %}', function () {
      const html = '{%raw%} {%if%} {%else {%endraw%}'
      const tokenizer = new Tokenizer(html)
      const tokens = tokenizer.readTopLevelTokens()

      expect(tokens.length).toBe(3)
      expect(tokens[0]).toHaveProperty('name', 'raw')
      expect((tokens[1] as any).getContent()).toBe(' {%if%} {%else ')
    })
    it('should allow unclosed endraw tag inside {% raw %}', function () {
      const html = '{%raw%} {%endraw {%raw%} {%endraw%}'
      const tokenizer = new Tokenizer(html)
      const tokens = tokenizer.readTopLevelTokens()

      expect(tokens.length).toBe(3)
      expect(tokens[0]).toHaveProperty('name', 'raw')
      expect((tokens[1] as any).getContent()).toBe(' {%endraw {%raw%} ')
    })
    it('should throw when {% raw %} not closed', function () {
      const html = '{%raw%} {%endraw {%raw%}'
      const tokenizer = new Tokenizer(html)
      expect(() => tokenizer.readTopLevelTokens()).toThrow('raw "{%raw%} {%endraw {%raw%}" not closed, line:1, col:8')
    })
    it('should read output token', function () {
      const html = '<p>{{foo | date: "%Y-%m-%d"}}</p>'
      const tokenizer = new Tokenizer(html)
      const tokens = tokenizer.readTopLevelTokens()

      expect(tokens.length).toBe(3)
      const output = tokens[1] as OutputToken
      expect(output).toBeInstanceOf(OutputToken)
      expect(output.content).toBe('foo | date: "%Y-%m-%d"')
    })
    it('should handle consecutive value and tags', function () {
      const html = '{{foo}}{{bar}}{%foo%}{%bar%}'
      const tokenizer = new Tokenizer(html)
      const tokens = tokenizer.readTopLevelTokens()

      expect(tokens.length).toBe(4)
      const o1 = tokens[0] as OutputToken
      const o2 = tokens[1] as OutputToken
      const t1 = tokens[2] as TagToken
      const t2 = tokens[3] as TagToken
      expect(o1).toBeInstanceOf(OutputToken)
      expect(o2).toBeInstanceOf(OutputToken)
      expect(t1).toBeInstanceOf(TagToken)
      expect(t2).toBeInstanceOf(TagToken)

      expect(o1.content).toBe('foo')
      expect(o2.content).toBe('bar')
      expect(t1.name).toBe('foo')
      expect(t1.args).toBe('')
      expect(t2.name).toBe('bar')
      expect(t2.args).toBe('')
    })
    it('should keep white spaces and newlines', function () {
      const html = '{%foo%}\n{%bar %}  \n {%alice%}'
      const tokenizer = new Tokenizer(html)
      const tokens = tokenizer.readTopLevelTokens()
      expect(tokens.length).toBe(5)
      expect(tokens[1]).toBeInstanceOf(HTMLToken)
      expect(tokens[1].getText()).toBe('\n')
      expect(tokens[3]).toBeInstanceOf(HTMLToken)
      expect(tokens[3].getText()).toBe('  \n ')
    })
    it('should handle multiple lines tag', function () {
      const html = '{%foo\na:a\nb:1.23\n%}'
      const tokenizer = new Tokenizer(html)
      const tokens = tokenizer.readTopLevelTokens()
      expect(tokens.length).toBe(1)
      expect(tokens[0]).toBeInstanceOf(TagToken)
      expect((tokens[0] as TagToken).args).toBe('a:a\nb:1.23')
      expect(tokens[0].getText()).toBe('{%foo\na:a\nb:1.23\n%}')
    })
    it('should handle multiple lines value', function () {
      const html = '{{foo\n|date:\n"%Y-%m-%d"\n}}'
      const tokenizer = new Tokenizer(html)
      const tokens = tokenizer.readTopLevelTokens()
      expect(tokens.length).toBe(1)
      expect(tokens[0]).toBeInstanceOf(OutputToken)
      expect(tokens[0].getText()).toBe('{{foo\n|date:\n"%Y-%m-%d"\n}}')
    })
    it('should handle complex object property access', function () {
      const html = '{{ obj["my:property with anything"] }}'
      const tokenizer = new Tokenizer(html)
      const tokens = tokenizer.readTopLevelTokens()
      expect(tokens.length).toBe(1)
      const output = tokens[0] as OutputToken
      expect(output).toBeInstanceOf(OutputToken)
      expect(output.content).toBe('obj["my:property with anything"]')
    })
    it('should throw if tag not closed', function () {
      const html = '{% assign foo = bar {{foo}}'
      const tokenizer = new Tokenizer(html)
      expect(() => tokenizer.readTopLevelTokens()).toThrow('tag "{% assign foo = bar {{foo}}" not closed, line:1, col:1')
    })
    it('should throw if output not closed', function () {
      const tokenizer = new Tokenizer('{{name}')
      expect(() => tokenizer.readTopLevelTokens()).toThrow(/output "{{name}" not closed/)
    })
  })
  describe('#readTagToken()', () => {
  })
  describe('#readOutputToken()', () => {
    it('should skip quoted delimiters', function () {
      const html = '{{ "%} {%" | append: "}} {{" }}'
      const tokenizer = new Tokenizer(html)
      const token = tokenizer.readOutputToken()

      expect(token).toBeInstanceOf(OutputToken)
      expect(token.content).toBe('"%} {%" | append: "}} {{"')
    })
  })
  describe('#readRange()', () => {
    it('should read `(1..3)`', () => {
      const range = new Tokenizer('(1..3)').readRange()
      expect(range).toBeInstanceOf(RangeToken)
      expect(range!.getText()).toEqual('(1..3)')
      const { lhs, rhs } = range!
      expect(lhs).toBeInstanceOf(NumberToken)
      expect(lhs.getText()).toBe('1')
      expect(rhs).toBeInstanceOf(NumberToken)
      expect(rhs.getText()).toBe('3')
    })
    it('should throw for `(..3)`', () => {
      expect(() => new Tokenizer('(..3)').readRange()).toThrow('unexpected token "..3)", value expected')
    })
    it('should read `(a.b..c["..d"])`', () => {
      const range = new Tokenizer('(a.b..c["..d"])').readRange()
      expect(range).toBeInstanceOf(RangeToken)
      expect(range!.getText()).toEqual('(a.b..c["..d"])')
    })
  })
  describe('#readFilter()', () => {
    it('should read a simple filter', function () {
      const tokenizer = new Tokenizer('| plus')
      const token = tokenizer.readFilter()
      expect(token).toHaveProperty('name', 'plus')
      expect(token).toHaveProperty('args', [])
    })
    it('should read a filter with argument', function () {
      const tokenizer = new Tokenizer(' | plus: 1')
      const token = tokenizer.readFilter()
      expect(token).toHaveProperty('name', 'plus')
      expect(token!.args).toHaveLength(1)

      const one: NumberToken = token!.args[0] as any
      expect(one).toBeInstanceOf(NumberToken)
      expect(one.getText()).toBe('1')
    })
    it('should read a filter with colon but no argument', function () {
      const tokenizer = new Tokenizer('| plus:')
      const token = tokenizer.readFilter()
      expect(token).toHaveProperty('name', 'plus')
      expect(token).toHaveProperty('args', [])
    })
    it('should read null if name not found', function () {
      const tokenizer = new Tokenizer('|')
      const token = tokenizer.readFilter()
      expect(token).toBeNull()
    })
    it('should read a filter with k/v argument', function () {
      const tokenizer = new Tokenizer(' | plus: a:1')
      const token = tokenizer.readFilter()
      expect(token).toHaveProperty('name', 'plus')
      expect(token!.args).toHaveLength(1)

      const [k, v]: [string, NumberToken] = token!.args[0] as any
      expect(k).toBe('a')
      expect(v).toBeInstanceOf(NumberToken)
      expect(v.getText()).toBe('1')
    })
    it('should read a filter with "arr[0]" argument', function () {
      const tokenizer = new Tokenizer('| plus: arr[0]')
      const token = tokenizer.readFilter()
      expect(token).toHaveProperty('name', 'plus')
      expect(token!.args).toHaveLength(1)

      const pa: PropertyAccessToken = token!.args[0] as any
      expect(token!.args[0]).toBeInstanceOf(PropertyAccessToken)
      expect(pa.props).toHaveLength(2)
      expect((pa.props[0] as any).content).toBe('arr')
      expect(pa.props[1]).toBeInstanceOf(NumberToken)
      expect(pa.props[1].getText()).toBe('0')
    })
    it('should read a filter with obj.foo argument', function () {
      const tokenizer = new Tokenizer('| plus: obj.foo')
      const token = tokenizer.readFilter()
      expect(token).toHaveProperty('name', 'plus')
      expect(token!.args).toHaveLength(1)

      const pa: PropertyAccessToken = token!.args[0] as any
      expect(token!.args[0]).toBeInstanceOf(PropertyAccessToken)
      expect(pa.props).toHaveLength(2)
      expect((pa.props[0] as any).content).toBe('obj')
      expect(pa.props[1]).toBeInstanceOf(IdentifierToken)
      expect(pa.props[1].getText()).toBe('foo')
    })
    it('should read a filter with obj["foo"] argument', function () {
      const tokenizer = new Tokenizer('| plus: obj["good luck"]')
      const token = tokenizer.readFilter()
      expect(token).toHaveProperty('name', 'plus')
      expect(token!.args).toHaveLength(1)

      const pa: PropertyAccessToken = token!.args[0] as any
      expect(token!.args[0]).toBeInstanceOf(PropertyAccessToken)
      expect(pa.getText()).toBe('obj["good luck"]')
      expect((pa.props[0] as any).content).toBe('obj')
      expect(pa.props[1].getText()).toBe('"good luck"')
    })
  })
  describe('#readFilters()', () => {
    it('should read simple filters', function () {
      const tokenizer = new Tokenizer('| plus: 3 | capitalize')
      const tokens = tokenizer.readFilters()

      expect(tokens).toHaveLength(2)
      expect(tokens[0]).toHaveProperty('name', 'plus')
      expect(tokens[0].args).toHaveLength(1)
      expect(tokens[0].args[0]).toBeInstanceOf(NumberToken)
      expect((tokens[0].args[0] as any).getText()).toBe('3')

      expect(tokens[1]).toHaveProperty('name', 'capitalize')
      expect(tokens[1].args).toHaveLength(0)
    })
    it('should read filters', function () {
      const tokenizer = new Tokenizer('| plus: a:3 | capitalize | append: foo[a.b["c d"]]')
      const tokens = tokenizer.readFilters()

      expect(tokens).toHaveLength(3)
      expect(tokens[0]).toHaveProperty('name', 'plus')
      expect(tokens[0].args).toHaveLength(1)
      const [k, v]: [string, NumberToken] = tokens[0].args[0] as any
      expect(k).toBe('a')
      expect(v).toBeInstanceOf(NumberToken)
      expect(v.getText()).toBe('3')

      expect(tokens[1]).toHaveProperty('name', 'capitalize')
      expect(tokens[1].args).toHaveLength(0)

      expect(tokens[2]).toHaveProperty('name', 'append')
      expect(tokens[2].args).toHaveLength(1)
      expect(tokens[2].args[0]).toBeInstanceOf(PropertyAccessToken)
      expect((tokens[2].args[0] as any).getText()).toBe('foo[a.b["c d"]]')
      expect((tokens[2].args[0] as any).props[1].getText()).toBe('a.b["c d"]')
    })
  })
  describe('#readExpression()', () => {
    it('should read expression `a `', () => {
      const exp = [...new Tokenizer('a ').readExpressionTokens()]

      expect(exp).toHaveLength(1)
      expect(exp[0]).toBeInstanceOf(PropertyAccessToken)
      expect(exp[0].getText()).toEqual('a')
    })
    it('should read expression `a[][b]`', () => {
      const exp = [...new Tokenizer('a[][b]').readExpressionTokens()]

      expect(exp).toHaveLength(1)
      const pa = exp[0] as PropertyAccessToken
      expect(pa).toBeInstanceOf(PropertyAccessToken)
      expect(pa.props).toHaveLength(3)
      expect((pa.props[0] as any).content).toEqual('a')

      const [, p1, p2] = pa.props
      expect(p1).toBeInstanceOf(IdentifierToken)
      expect(p1.getText()).toBe('')
      expect(p2).toBeInstanceOf(PropertyAccessToken)
      expect(p2.getText()).toBe('b')
    })
    it('should read expression `a.`', () => {
      const exp = [...new Tokenizer('a.').readExpressionTokens()]

      expect(exp).toHaveLength(1)
      const pa = exp[0] as PropertyAccessToken
      expect(pa).toBeInstanceOf(PropertyAccessToken)
      expect(pa.props).toHaveLength(1)
      expect((pa.props[0] as any).content).toEqual('a')
    })
    it('should read expression `a ==`', () => {
      const exp = [...new Tokenizer('a ==').readExpressionTokens()]

      expect(exp).toHaveLength(2)
      expect(exp[0]).toBeInstanceOf(PropertyAccessToken)
      expect(exp[0].getText()).toEqual('a')
      expect(exp[1]).toBeInstanceOf(OperatorToken)
      expect(exp[1].getText()).toEqual('==')
    })
    it('should read expression `a==b`', () => {
      const exp = new Tokenizer('a==b').readExpressionTokens()
      const [a, equals, b] = exp

      expect(a).toBeInstanceOf(PropertyAccessToken)
      expect(a.getText()).toEqual('a')

      expect(equals).toBeInstanceOf(OperatorToken)
      expect(equals.getText()).toBe('==')

      expect(b).toBeInstanceOf(PropertyAccessToken)
      expect(b.getText()).toEqual('b')
    })
    it('should read expression `^`', () => {
      const exp = new Tokenizer('^').readExpressionTokens()
      expect([...exp]).toEqual([])
    })
    it('should read expression `a == b`', () => {
      const exp = new Tokenizer('a == b').readExpressionTokens()
      const [a, equals, b] = exp

      expect(a).toBeInstanceOf(PropertyAccessToken)
      expect(a.getText()).toEqual('a')

      expect(equals).toBeInstanceOf(OperatorToken)
      expect(equals.getText()).toBe('==')

      expect(b).toBeInstanceOf(PropertyAccessToken)
      expect(b.getText()).toEqual('b')
    })
    it('should read expression `(1..3) contains 3`', () => {
      const exp = new Tokenizer('(1..3) contains 3').readExpressionTokens()
      const [range, contains, rhs] = exp

      expect(range).toBeInstanceOf(RangeToken)
      expect(range.getText()).toEqual('(1..3)')

      expect(contains).toBeInstanceOf(OperatorToken)
      expect(contains.getText()).toBe('contains')

      expect(rhs).toBeInstanceOf(NumberToken)
      expect(rhs.getText()).toEqual('3')
    })
    it('should read expression `a[b] == c`', () => {
      const exp = new Tokenizer('a[b] == c').readExpressionTokens()
      const [lhs, contains, rhs] = exp

      expect(lhs).toBeInstanceOf(PropertyAccessToken)
      expect(lhs.getText()).toEqual('a[b]')

      expect(contains).toBeInstanceOf(OperatorToken)
      expect(contains.getText()).toBe('==')

      expect(rhs).toBeInstanceOf(PropertyAccessToken)
      expect(rhs.getText()).toEqual('c')
    })
    it('should read expression `c[a["b"]] >= c`', () => {
      const exp = new Tokenizer('c[a["b"]] >= c').readExpressionTokens()
      const [lhs, op, rhs] = exp

      expect(lhs).toBeInstanceOf(PropertyAccessToken)
      expect(lhs.getText()).toEqual('c[a["b"]]')

      expect(op).toBeInstanceOf(OperatorToken)
      expect(op.getText()).toBe('>=')

      expect(rhs).toBeInstanceOf(PropertyAccessToken)
      expect(rhs.getText()).toEqual('c')
    })
    it('should read expression `"][" == var`', () => {
      const exp = new Tokenizer('"][" == var').readExpressionTokens()
      const [lhs, equals, rhs] = exp

      expect(lhs).toBeInstanceOf(QuotedToken)
      expect(lhs.getText()).toEqual('"]["')

      expect(equals).toBeInstanceOf(OperatorToken)
      expect(equals.getText()).toBe('==')

      expect(rhs).toBeInstanceOf(PropertyAccessToken)
      expect(rhs.getText()).toEqual('var')
    })
    it('should read expression `"\\\'" == "\\""`', () => {
      const exp = new Tokenizer('"\\\'" == "\\""').readExpressionTokens()
      const [lhs, equals, rhs] = exp

      expect(lhs).toBeInstanceOf(QuotedToken)
      expect(lhs.getText()).toEqual('"\\\'"')

      expect(equals).toBeInstanceOf(OperatorToken)
      expect(equals.getText()).toBe('==')

      expect(rhs).toBeInstanceOf(QuotedToken)
      expect(rhs.getText()).toEqual('"\\""')
    })
  })
  describe('#matchTrie()', function () {
    const opTrie = createTrie(defaultOperators)
    it('should match contains', () => {
      expect(new Tokenizer('contains').matchTrie(opTrie)).toBe(8)
    })
    it('should match comparison', () => {
      expect(new Tokenizer('>').matchTrie(opTrie)).toBe(1)
      expect(new Tokenizer('>=').matchTrie(opTrie)).toBe(2)
      expect(new Tokenizer('<').matchTrie(opTrie)).toBe(1)
      expect(new Tokenizer('<=').matchTrie(opTrie)).toBe(2)
    })
    it('should match binary logic', () => {
      expect(new Tokenizer('and').matchTrie(opTrie)).toBe(3)
      expect(new Tokenizer('or').matchTrie(opTrie)).toBe(2)
    })
    it('should not match if word not terminate', () => {
      expect(new Tokenizer('true1').matchTrie(opTrie)).toBe(-1)
      expect(new Tokenizer('containsa').matchTrie(opTrie)).toBe(-1)
    })
    it('should match if word boundary found', () => {
      expect(new Tokenizer('>=1').matchTrie(opTrie)).toBe(2)
      expect(new Tokenizer('contains b').matchTrie(opTrie)).toBe(8)
    })
  })
  describe('#readLiquidTagTokens', () => {
    it('should read newline terminated tokens', () => {
      const tokenizer = new Tokenizer('echo \'hello\'')
      const tokens = tokenizer.readLiquidTagTokens()
      expect(tokens.length).toBe(1)
      const tag = tokens[0]
      expect(tag).toBeInstanceOf(LiquidTagToken)
      expect(tag.name).toBe('echo')
      expect(tag.args).toBe('\'hello\'')
    })
    it('should gracefully handle empty lines', () => {
      const tokenizer = new Tokenizer(`
        echo 'hello'

        decrement foo
        `)
      const tokens = tokenizer.readLiquidTagTokens()
      expect(tokens.length).toBe(2)
    })
    it('should throw if line does not start with an identifier', () => {
      const tokenizer = new Tokenizer('!')
      expect(() => tokenizer.readLiquidTagTokens()).toThrow(/illegal liquid tag syntax/)
    })
  })
  describe('#read inline comment tags', () => {
    it('should allow hash characters in tag names', () => {
      const tokenizer = new Tokenizer('{% # some comment %}')
      const tokens = tokenizer.readTopLevelTokens()
      expect(tokens.length).toBe(1)
      const tag = tokens[0] as TagToken
      expect(tag).toBeInstanceOf(TagToken)
      expect(tag.name).toBe('#')
      expect(tag.args).toBe('some comment')
    })
    it('should handle leading whitespace', () => {
      const tokenizer = new Tokenizer('{%\n  # some comment %}')
      const tokens = tokenizer.readTopLevelTokens()
      expect(tokens.length).toBe(1)
      const tag = tokens[0] as TagToken
      expect(tag).toBeInstanceOf(TagToken)
      expect(tag.name).toBe('#')
      expect(tag.args).toBe('some comment')
    })
    it('should handle no trailing whitespace', () => {
      const tokenizer = new Tokenizer('{%\n  #some comment %}')
      const tokens = tokenizer.readTopLevelTokens()
      expect(tokens.length).toBe(1)
      const tag = tokens[0] as TagToken
      expect(tag).toBeInstanceOf(TagToken)
      expect(tag.name).toBe('#')
      expect(tag.args).toBe('some comment')
    })
  })
})
