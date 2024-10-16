import { FilteredValueToken, TagToken, HTMLToken, HashToken, QuotedToken, LiquidTagToken, OutputToken, ValueToken, Token, RangeToken, FilterToken, TopLevelToken, PropertyAccessToken, OperatorToken, LiteralToken, IdentifierToken, NumberToken } from '../tokens'
import { OperatorHandler } from '../render/operator'
import { TrieNode, LiteralValue, Trie, createTrie, ellipsis, literalValues, TokenizationError, TYPES, QUOTE, BLANK, NUMBER, SIGN, isWord, isString } from '../util'
import { Operators, Expression } from '../render'
import { NormalizedFullOptions, defaultOptions } from '../liquid-options'
import { FilterArg } from './filter-arg'
import { whiteSpaceCtrl } from './whitespace-ctrl'

export class Tokenizer {
  p: number
  N: number
  private rawBeginAt = -1
  private opTrie: Trie<OperatorHandler>
  private literalTrie: Trie<LiteralValue>

  constructor (
    public input: string,
    operators: Operators = defaultOptions.operators,
    public file?: string,
    range?: [number, number]
  ) {
    this.p = range ? range[0] : 0
    this.N = range ? range[1] : input.length
    this.opTrie = createTrie(operators)
    this.literalTrie = createTrie(literalValues)
  }

  readExpression () {
    return new Expression(this.readExpressionTokens())
  }

  * readExpressionTokens (): IterableIterator<Token> {
    while (this.p < this.N) {
      const operator = this.readOperator()
      if (operator) {
        yield operator
        continue
      }
      const operand = this.readValue()
      if (operand) {
        yield operand
        continue
      }
      return
    }
  }
  readOperator (): OperatorToken | undefined {
    this.skipBlank()
    const end = this.matchTrie(this.opTrie)
    if (end === -1) return
    return new OperatorToken(this.input, this.p, (this.p = end), this.file)
  }
  matchTrie<T> (trie: Trie<T>) {
    let node: TrieNode<T> = trie
    let i = this.p
    let info
    while (node[this.input[i]] && i < this.N) {
      node = node[this.input[i++]]
      if (node['end']) info = node
    }
    if (!info) return -1
    if (info['needBoundary'] && isWord(this.peek(i - this.p))) return -1
    return i
  }
  readFilteredValue (): FilteredValueToken {
    const begin = this.p
    const initial = this.readExpression()
    this.assert(initial.valid(), `invalid value expression: ${this.snapshot()}`)
    const filters = this.readFilters()
    return new FilteredValueToken(initial, filters, this.input, begin, this.p, this.file)
  }
  readFilters (): FilterToken[] {
    const filters = []
    while (true) {
      const filter = this.readFilter()
      if (!filter) return filters
      filters.push(filter)
    }
  }
  readFilter (): FilterToken | null {
    this.skipBlank()
    if (this.end()) return null
    this.assert(this.read() === '|', `expected "|" before filter`)
    const name = this.readIdentifier()
    if (!name.size()) {
      this.assert(this.end(), `expected filter name`)
      return null
    }
    const args = []
    this.skipBlank()
    if (this.peek() === ':') {
      do {
        ++this.p
        const arg = this.readFilterArg()
        arg && args.push(arg)
        this.skipBlank()
        this.assert(this.end() || this.peek() === ',' || this.peek() === '|', () => `unexpected character ${this.snapshot()}`)
      } while (this.peek() === ',')
    } else if (this.peek() === '|' || this.end()) {
      // do nothing
    } else {
      throw this.error('expected ":" after filter name')
    }
    return new FilterToken(name.getText(), args, this.input, name.begin, this.p, this.file)
  }

  readFilterArg (): FilterArg | undefined {
    const key = this.readValue()
    if (!key) return
    this.skipBlank()
    if (this.peek() !== ':') return key
    ++this.p
    const value = this.readValue()
    return [key.getText(), value]
  }

  readTopLevelTokens (options: NormalizedFullOptions = defaultOptions): TopLevelToken[] {
    const tokens: TopLevelToken[] = []
    while (this.p < this.N) {
      const token = this.readTopLevelToken(options)
      tokens.push(token)
    }
    whiteSpaceCtrl(tokens, options)
    return tokens
  }

  readTopLevelToken (options: NormalizedFullOptions): TopLevelToken {
    const { tagDelimiterLeft, outputDelimiterLeft } = options
    if (this.rawBeginAt > -1) return this.readEndrawOrRawContent(options)
    if (this.match(tagDelimiterLeft)) return this.readTagToken(options)
    if (this.match(outputDelimiterLeft)) return this.readOutputToken(options)
    return this.readHTMLToken([tagDelimiterLeft, outputDelimiterLeft])
  }

  readHTMLToken (stopStrings: string[]): HTMLToken {
    const begin = this.p
    while (this.p < this.N) {
      if (stopStrings.some(str => this.match(str))) break
      ++this.p
    }
    return new HTMLToken(this.input, begin, this.p, this.file)
  }

  readTagToken (options: NormalizedFullOptions): TagToken {
    const { file, input } = this
    const begin = this.p
    if (this.readToDelimiter(options.tagDelimiterRight) === -1) {
      throw this.error(`tag ${this.snapshot(begin)} not closed`, begin)
    }
    const token = new TagToken(input, begin, this.p, options, file)
    if (token.name === 'raw') this.rawBeginAt = begin
    return token
  }

  readToDelimiter (delimiter: string, respectQuoted = false) {
    this.skipBlank()
    while (this.p < this.N) {
      if (respectQuoted && (this.peekType() & QUOTE)) {
        this.readQuoted()
        continue
      }
      ++this.p
      if (this.rmatch(delimiter)) return this.p
    }
    return -1
  }

  readOutputToken (options: NormalizedFullOptions = defaultOptions): OutputToken {
    const { file, input } = this
    const { outputDelimiterRight } = options
    const begin = this.p
    if (this.readToDelimiter(outputDelimiterRight, true) === -1) {
      throw this.error(`output ${this.snapshot(begin)} not closed`, begin)
    }
    return new OutputToken(input, begin, this.p, options, file)
  }

  readEndrawOrRawContent (options: NormalizedFullOptions): HTMLToken | TagToken {
    const { tagDelimiterLeft, tagDelimiterRight } = options
    const begin = this.p
    let leftPos = this.readTo(tagDelimiterLeft) - tagDelimiterLeft.length
    while (this.p < this.N) {
      if (this.readIdentifier().getText() !== 'endraw') {
        leftPos = this.readTo(tagDelimiterLeft) - tagDelimiterLeft.length
        continue
      }
      while (this.p <= this.N) {
        if (this.rmatch(tagDelimiterRight)) {
          const end = this.p
          if (begin === leftPos) {
            this.rawBeginAt = -1
            return new TagToken(this.input, begin, end, options, this.file)
          } else {
            this.p = leftPos
            return new HTMLToken(this.input, begin, leftPos, this.file)
          }
        }
        if (this.rmatch(tagDelimiterLeft)) break
        this.p++
      }
    }
    throw this.error(`raw ${this.snapshot(this.rawBeginAt)} not closed`, begin)
  }

  readLiquidTagTokens (options: NormalizedFullOptions = defaultOptions): LiquidTagToken[] {
    const tokens: LiquidTagToken[] = []
    while (this.p < this.N) {
      const token = this.readLiquidTagToken(options)
      token && tokens.push(token)
    }
    return tokens
  }

  readLiquidTagToken (options: NormalizedFullOptions): LiquidTagToken | undefined {
    this.skipBlank()
    if (this.end()) return

    const begin = this.p
    this.readToDelimiter('\n')
    const end = this.p
    return new LiquidTagToken(this.input, begin, end, options, this.file)
  }

  error (msg: string, pos: number = this.p) {
    return new TokenizationError(msg, new IdentifierToken(this.input, pos, this.N, this.file))
  }

  assert (pred: unknown, msg: string | (() => string), pos?: number) {
    if (!pred) throw this.error(typeof msg === 'function' ? msg() : msg, pos)
  }

  snapshot (begin: number = this.p) {
    return JSON.stringify(ellipsis(this.input.slice(begin, this.N), 32))
  }

  /**
   * @deprecated use #readIdentifier instead
   */
  readWord () {
    return this.readIdentifier()
  }

  readIdentifier (): IdentifierToken {
    this.skipBlank()
    const begin = this.p
    while (!this.end() && isWord(this.peek())) ++this.p
    return new IdentifierToken(this.input, begin, this.p, this.file)
  }

  readNonEmptyIdentifier (): IdentifierToken | undefined {
    const id = this.readIdentifier()
    return id.size() ? id : undefined
  }

  readTagName (): string {
    this.skipBlank()
    // Handle inline comment tags
    if (this.input[this.p] === '#') return this.input.slice(this.p, ++this.p)
    return this.readIdentifier().getText()
  }

  readHashes (jekyllStyle?: boolean | string) {
    const hashes = []
    while (true) {
      const hash = this.readHash(jekyllStyle)
      if (!hash) return hashes
      hashes.push(hash)
    }
  }

  readHash (jekyllStyle?: boolean | string): HashToken | undefined {
    this.skipBlank()
    if (this.peek() === ',') ++this.p
    const begin = this.p
    const name = this.readNonEmptyIdentifier()
    if (!name) return
    let value

    this.skipBlank()
    const sep = isString(jekyllStyle) ? jekyllStyle : (jekyllStyle ? '=' : ':')
    if (this.peek() === sep) {
      ++this.p
      value = this.readValue()
    }
    return new HashToken(this.input, begin, this.p, name, value, this.file)
  }

  remaining () {
    return this.input.slice(this.p, this.N)
  }

  advance (step = 1) {
    this.p += step
  }

  end () {
    return this.p >= this.N
  }
  read () {
    return this.input[this.p++]
  }
  readTo (end: string): number {
    while (this.p < this.N) {
      ++this.p
      if (this.rmatch(end)) return this.p
    }
    return -1
  }

  readValue (): ValueToken | undefined {
    this.skipBlank()
    const begin = this.p
    const variable = this.readLiteral() || this.readQuoted() || this.readRange() || this.readNumber()
    const props = this.readProperties(!variable)
    if (!props.length) return variable
    return new PropertyAccessToken(variable, props, this.input, begin, this.p)
  }

  readScopeValue (): ValueToken | undefined {
    this.skipBlank()
    const begin = this.p
    const props = this.readProperties()
    if (!props.length) return undefined
    return new PropertyAccessToken(undefined, props, this.input, begin, this.p)
  }

  private readProperties (isBegin = true): (ValueToken | IdentifierToken)[] {
    const props: (ValueToken | IdentifierToken)[] = []
    while (true) {
      if (this.peek() === '[') {
        this.p++
        const prop = this.readValue() || new IdentifierToken(this.input, this.p, this.p, this.file)
        this.assert(this.readTo(']') !== -1, '[ not closed')
        props.push(prop)
        continue
      }
      if (isBegin && !props.length) {
        const prop = this.readNonEmptyIdentifier()
        if (prop) {
          props.push(prop)
          continue
        }
      }
      if (this.peek() === '.' && this.peek(1) !== '.') { // skip range syntax
        this.p++
        const prop = this.readNonEmptyIdentifier()
        if (!prop) break
        props.push(prop)
        continue
      }
      break
    }
    return props
  }

  readNumber (): NumberToken | undefined {
    this.skipBlank()
    let decimalFound = false
    let digitFound = false
    let n = 0
    if (this.peekType() & SIGN) n++
    while (this.p + n <= this.N) {
      if (this.peekType(n) & NUMBER) {
        digitFound = true
        n++
      } else if (this.peek(n) === '.' && this.peek(n + 1) !== '.') {
        if (decimalFound || !digitFound) return
        decimalFound = true
        n++
      } else break
    }
    if (digitFound && !isWord(this.peek(n))) {
      const num = new NumberToken(this.input, this.p, this.p + n, this.file)
      this.advance(n)
      return num
    }
  }

  readLiteral (): LiteralToken | undefined {
    this.skipBlank()
    const end = this.matchTrie(this.literalTrie)
    if (end === -1) return
    const literal = new LiteralToken(this.input, this.p, end, this.file)
    this.p = end
    return literal
  }

  readRange (): RangeToken | undefined {
    this.skipBlank()
    const begin = this.p
    if (this.peek() !== '(') return
    ++this.p
    const lhs = this.readValueOrThrow()
    this.p += 2
    const rhs = this.readValueOrThrow()
    ++this.p
    return new RangeToken(this.input, begin, this.p, lhs, rhs, this.file)
  }

  readValueOrThrow (): ValueToken {
    const value = this.readValue()
    this.assert(value, () => `unexpected token ${this.snapshot()}, value expected`)
    return value!
  }

  readQuoted (): QuotedToken | undefined {
    this.skipBlank()
    const begin = this.p
    if (!(this.peekType() & QUOTE)) return
    ++this.p
    let escaped = false
    while (this.p < this.N) {
      ++this.p
      if (this.input[this.p - 1] === this.input[begin] && !escaped) break
      if (escaped) escaped = false
      else if (this.input[this.p - 1] === '\\') escaped = true
    }
    return new QuotedToken(this.input, begin, this.p, this.file)
  }

  * readFileNameTemplate (options: NormalizedFullOptions): IterableIterator<TopLevelToken> {
    const { outputDelimiterLeft } = options
    const htmlStopStrings = [',', ' ', outputDelimiterLeft]
    const htmlStopStringSet = new Set(htmlStopStrings)
    // break on ',' and ' ', outputDelimiterLeft only stops HTML token
    while (this.p < this.N && !htmlStopStringSet.has(this.peek())) {
      yield this.match(outputDelimiterLeft)
        ? this.readOutputToken(options)
        : this.readHTMLToken(htmlStopStrings)
    }
  }

  match (word: string) {
    for (let i = 0; i < word.length; i++) {
      if (word[i] !== this.input[this.p + i]) return false
    }
    return true
  }

  rmatch (pattern: string) {
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[pattern.length - 1 - i] !== this.input[this.p - 1 - i]) return false
    }
    return true
  }

  peekType (n = 0) {
    return this.p + n >= this.N ? 0 : TYPES[this.input.charCodeAt(this.p + n)]
  }

  peek (n = 0): string {
    return this.p + n >= this.N ? '' : this.input[this.p + n]
  }

  skipBlank () {
    while (this.peekType() & BLANK) ++this.p
  }
}
