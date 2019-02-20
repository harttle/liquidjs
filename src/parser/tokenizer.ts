import whiteSpaceCtrl from './whitespace-ctrl'
import HTMLToken from './html-token'
import TagToken from './tag-token'
import Token from './token'
import OutputToken from './output-token'
import { TokenizationError } from 'src/util/error'
import { LiquidOptions, defaultOptions } from 'src/liquid-options'

enum ParseState { HTML, OUTPUT, TAG }

export default class Tokenizer {
  options: LiquidOptions
  constructor (options: LiquidOptions = defaultOptions) {
    this.options = options
  }
  tokenize (input: string, file?: string) {
    const tokens = []
    let p = 0
    let curLine = 1
    let state = ParseState.HTML
    let buffer = ''
    let lineBegin = 0
    let line = 1
    let col = 1

    while (p < input.length) {
      if (input[p] === '\n') {
        curLine++
        lineBegin = p + 1
      }
      const bin = input.substr(p, 2)
      if (state === ParseState.HTML) {
        if (bin === '{{' || bin === '{%') {
          if (buffer) tokens.push(new HTMLToken(buffer, col, input, file, line))
          buffer = bin
          line = curLine
          col = p - lineBegin + 1
          p += 2
          state = bin === '{{' ? ParseState.OUTPUT : ParseState.TAG
          continue
        }
      } else if (state === ParseState.OUTPUT && bin === '}}') {
        buffer += '}}'
        tokens.push(new OutputToken(buffer, col, input, file, line))
        p += 2
        buffer = ''
        line = curLine
        col = p - lineBegin + 1
        state = ParseState.HTML
        continue
      } else if (bin === '%}') {
        buffer += '%}'
        tokens.push(new TagToken(buffer, col, input, file, line))
        p += 2
        buffer = ''
        line = curLine
        col = p - lineBegin + 1
        state = ParseState.HTML
        continue
      }
      buffer += input[p++]
    }
    if (state !== ParseState.HTML) {
      const t = state === ParseState.OUTPUT ? 'output' : 'tag'
      const str = buffer.length > 16 ? buffer.slice(0, 13) + '...' : buffer
      throw new TokenizationError(
        new Error(`${t} "${str}" not closed`),
        new Token(buffer, col, input, file, line)
      )
    }
    if (buffer) tokens.push(new HTMLToken(buffer, col, input, file, line))

    whiteSpaceCtrl(tokens, this.options)
    return tokens
  }
}
