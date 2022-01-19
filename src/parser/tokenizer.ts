import { whiteSpaceCtrl } from './whitespace-ctrl'
import { NumberToken } from '../tokens/number-token'
import { IdentifierToken } from '../tokens/identifier-token'
import { literalValues } from '../util/literal'
import { LiteralToken } from '../tokens/literal-token'
import { OperatorToken } from '../tokens/operator-token'
import { PropertyAccessToken } from '../tokens/property-access-token'
import { assert } from '../util/assert'
import { TopLevelToken } from '../tokens/toplevel-token'
import { FilterArg } from './filter-arg'
import { FilterToken } from '../tokens/filter-token'
import { HashToken } from '../tokens/hash-token'
import { QuotedToken } from '../tokens/quoted-token'
import { ellipsis } from '../util/underscore'
import { HTMLToken } from '../tokens/html-token'
import { TagToken } from '../tokens/tag-token'
import { Token } from '../tokens/token'
import { RangeToken } from '../tokens/range-token'
import { ValueToken } from '../tokens/value-token'
import { OutputToken } from '../tokens/output-token'
import { TokenizationError } from '../util/error'
import { NormalizedFullOptions, defaultOptions } from '../liquid-options'
import { TYPES, QUOTE, BLANK, IDENTIFIER } from '../util/character'
import { matchOperator } from './match-operator'
import { Trie } from '../util/operator-trie'
import { Expression } from '../render/expression'
import { LiquidTagToken } from '../tokens/liquid-tag-token'

export class Tokenizer {
  p = 0
  N: number
  private rawBeginAt = -1

  constructor (
    public input: string,
    private trie: Trie,
    public file: string = ''
  ) {
    this.N = input.length
  }

  readExpression () {
    return new Expression(this.readExpressionTokens())
  }

  * readExpressionTokens (): IterableIterator<Token> {
    const operand = this.readValue()
    if (!operand) return

    yield operand

    while (this.p < this.N) {
      const operator = this.readOperator()
      if (!operator) return

      const operand = this.readValue()
      if (!operand) return

      yield operator
      yield operand
    }
  }
  readOperator (): OperatorToken | undefined {
    this.skipBlank()
    const end = matchOperator(this.input, this.p, this.trie)
    if (end === -1) return
    return new OperatorToken(this.input, this.p, (this.p = end), this.file)
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
    assert(this.peek() === '|', () => `unexpected token at ${this.snapshot()}`)
    this.p++
    const begin = this.p
    const name = this.readIdentifier()
    if (!name.size()) return null
    const args = []
    this.skipBlank()
    if (this.peek() === ':') {
      do {
        ++this.p
        const arg = this.readFilterArg()
        arg && args.push(arg)
        while (this.p < this.N && this.peek() !== ',' && this.peek() !== '|') ++this.p
      } while (this.peek() === ',')
    }
    return new FilterToken(name.getText(), args, this.input, begin, this.p, this.file)
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

  readTagToken (options: NormalizedFullOptions = defaultOptions): TagToken {
    const { file, input } = this
    const begin = this.p
    if (this.readToDelimiter(options.tagDelimiterRight) === -1) {
      throw this.mkError(`tag ${this.snapshot(begin)} not closed`, begin)
    }
    const token = new TagToken(input, begin, this.p, options, file)
    if (token.name === 'raw') this.rawBeginAt = begin
    return token
  }

  readToDelimiter (delimiter: string) {
    while (this.p < this.N) {
      if ((this.peekType() & QUOTE)) {
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
    if (this.readToDelimiter(outputDelimiterRight) === -1) {
      throw this.mkError(`output ${this.snapshot(begin)} not closed`, begin)
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
    throw this.mkError(`raw ${this.snapshot(this.rawBeginAt)} not closed`, begin)
  }

  readLiquidTagTokens (options: NormalizedFullOptions = defaultOptions): LiquidTagToken[] {
    const tokens: LiquidTagToken[] = []
    while (this.p < this.N) {
      const token = this.readLiquidTagToken(options)
      if (token.name) tokens.push(token)
    }
    return tokens
  }

  readLiquidTagToken (options: NormalizedFullOptions): LiquidTagToken {
    const { file, input } = this
    const begin = this.p
    let end = this.N
    if (this.readToDelimiter('\n') !== -1) end = this.p
    const token = new LiquidTagToken(input, begin, end, options, file)
    return token
  }

  mkError (msg: string, begin: number) {
    return new TokenizationError(msg, new IdentifierToken(this.input, begin, this.N, this.file))
  }

  snapshot (begin: number = this.p) {
    return JSON.stringify(ellipsis(this.input.slice(begin), 16))
  }

  /**
   * @deprecated
   */
  readWord () {
    console.warn('Tokenizer#readWord() will be removed, use #readIdentifier instead')
    return this.readIdentifier()
  }

  readIdentifier (): IdentifierToken {
    this.skipBlank()
    const begin = this.p
    while (this.peekType() & IDENTIFIER) ++this.p
    return new IdentifierToken(this.input, begin, this.p, this.file)
  }

  readHashes (jekyllStyle?: boolean) {
    const hashes = []
    while (true) {
      const hash = this.readHash(jekyllStyle)
      if (!hash) return hashes
      hashes.push(hash)
    }
  }

  readHash (jekyllStyle?: boolean): HashToken | undefined {
    this.skipBlank()
    if (this.peek() === ',') ++this.p
    const begin = this.p
    const name = this.readIdentifier()
    if (!name.size()) return
    let value

    this.skipBlank()
    const sep = jekyllStyle ? '=' : ':'
    if (this.peek() === sep) {
      ++this.p
      value = this.readValue()
    }
    return new HashToken(this.input, begin, this.p, name, value, this.file)
  }

  remaining () {
    return this.input.slice(this.p)
  }

  advance (i = 1) {
    this.p += i
  }

  end () {
    return this.p >= this.N
  }

  readTo (end: string): number {
    while (this.p < this.N) {
      ++this.p
      if (this.rmatch(end)) return this.p
    }
    return -1
  }

  readValue (): ValueToken | undefined {
    const value = this.readQuoted() || this.readRange()
    if (value) return value

    if (this.peek() === '[') {
      this.p++
      const prop = this.readQuoted()
      if (!prop) return
      if (this.peek() !== ']') return
      this.p++
      return new PropertyAccessToken(prop, [], this.p)
    }

    const variable = this.readIdentifier()
    if (!variable.size()) return

    let isNumber = variable.isNumber(true)
    const props: (QuotedToken | IdentifierToken)[] = []
    while (true) {
      if (this.peek() === '[') {
        isNumber = false
        this.p++
        const prop = this.readValue() || new IdentifierToken(this.input, this.p, this.p, this.file)
        this.readTo(']')
        props.push(prop)
      } else if (this.peek() === '.' && this.peek(1) !== '.') { // skip range syntax
        this.p++
        const prop = this.readIdentifier()
        if (!prop.size()) break
        if (!prop.isNumber()) isNumber = false
        props.push(prop)
      } else break
    }
    if (!props.length && literalValues.hasOwnProperty(variable.content)) {
      return new LiteralToken(this.input, variable.begin, variable.end, this.file)
    }
    if (isNumber) return new NumberToken(variable, props[0] as IdentifierToken)
    return new PropertyAccessToken(variable, props, this.p)
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
    assert(value, () => `unexpected token ${this.snapshot()}, value expected`)
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
    return TYPES[this.input.charCodeAt(this.p + n)]
  }

  peek (n = 0) {
    return this.input[this.p + n]
  }

  skipBlank () {
    while (this.peekType() & BLANK) ++this.p
  }
}
