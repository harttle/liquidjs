import { whiteSpaceCtrl } from './whitespace-ctrl'
import { NumberToken } from '../tokens/number-token'
import { WordToken } from '../tokens/word-token'
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
import { TYPES, QUOTE, BLANK, VARIABLE } from '../util/character'
import { matchOperator } from './match-operator'

export class Tokenizer {
  p = 0
  N: number
  constructor (
    private input: string,
    private file: string = ''
  ) {
    this.N = input.length
  }

  * readExpression (): IterableIterator<Token> {
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
    const end = matchOperator(this.input, this.p, this.p + 8)
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
    this.readTo('|')
    const begin = this.p
    const name = this.readWord()
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
    if (this.matchWord(tagDelimiterLeft)) return this.readTagToken(options)
    if (this.matchWord(outputDelimiterLeft)) return this.readOutputToken(options)
    return this.readHTMLToken(options)
  }

  readHTMLToken (options: NormalizedFullOptions): HTMLToken {
    const begin = this.p
    while (this.p < this.N) {
      const { tagDelimiterLeft, outputDelimiterLeft } = options
      if (this.matchWord(tagDelimiterLeft)) break
      if (this.matchWord(outputDelimiterLeft)) break
      ++this.p
    }
    return new HTMLToken(this.input, begin, this.p, this.file)
  }

  readTagToken (options: NormalizedFullOptions): TagToken {
    const { file, input } = this
    const { tagDelimiterRight } = options
    const begin = this.p
    if (this.readTo(tagDelimiterRight) === -1) {
      this.mkError(`tag "${this.ellipsis(begin)}" not closed`, begin)
    }
    return new TagToken(input, begin, this.p, options, file)
  }

  readOutputToken (options: NormalizedFullOptions): OutputToken {
    const { file, input } = this
    const { outputDelimiterRight } = options
    const begin = this.p
    if (this.readTo(outputDelimiterRight) === -1) {
      this.mkError(`output "${this.ellipsis(begin)}" not closed`, begin)
    }
    return new OutputToken(input, begin, this.p, options, file)
  }

  mkError (msg: string, begin: number) {
    throw new TokenizationError(msg, new WordToken(this.input, begin, this.N, this.file))
  }

  ellipsis (begin: number = this.p) {
    return ellipsis(this.input.slice(begin), 16)
  }

  readWord (): WordToken { // rename to identifier
    this.skipBlank()
    const begin = this.p
    while (this.peekType() & VARIABLE) ++this.p
    return new WordToken(this.input, begin, this.p, this.file)
  }

  readHashes () {
    const hashes = []
    while (true) {
      const hash = this.readHash()
      if (!hash) return hashes
      hashes.push(hash)
    }
  }

  readHash (): HashToken | undefined {
    this.skipBlank()
    if (this.peek() === ',') ++this.p
    const begin = this.p
    const name = this.readWord()
    if (!name.size()) return
    let value

    this.skipBlank()
    if (this.peek() === ':') {
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
      if (this.reverseMatchWord(end)) return this.p
    }
    return -1
  }

  readValue (): ValueToken | undefined {
    const value = this.readQuoted() || this.readRange()
    if (value) return value

    const variable = this.readWord()
    if (!variable.size()) return

    let isNumber = variable.isNumber(true)
    const props: (QuotedToken | WordToken)[] = []
    while (true) {
      if (this.peek() === '[') {
        isNumber = false
        this.p++
        const prop = this.readValue() || new WordToken(this.input, this.p, this.p, this.file)
        this.readTo(']')
        props.push(prop)
      } else if (this.peek() === '.' && this.peek(1) !== '.') { // skip range syntax
        this.p++
        const prop = this.readWord()
        if (!prop.size()) break
        if (!prop.isNumber()) isNumber = false
        props.push(prop)
      } else break
    }
    if (!props.length && literalValues.hasOwnProperty(variable.content)) {
      return new LiteralToken(this.input, variable.begin, variable.end, this.file)
    }
    if (isNumber) return new NumberToken(variable, props[0] as WordToken)
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
    assert(value, () => `unexpected token "${this.ellipsis()}", value expected`)
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

  readFileName (): WordToken {
    const begin = this.p
    while (!(this.peekType() & BLANK) && this.peek() !== ',' && this.p < this.N) this.p++
    return new WordToken(this.input, begin, this.p, this.file)
  }

  matchWord (word: string) {
    for (let i = 0; i < word.length; i++) {
      if (word[i] !== this.input[this.p + i]) return false
    }
    return true
  }

  reverseMatchWord (word: string) {
    for (let i = 0; i < word.length; i++) {
      if (word[word.length - 1 - i] !== this.input[this.p - 1 - i]) return false
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
