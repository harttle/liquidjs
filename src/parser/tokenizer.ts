import whiteSpaceCtrl from './whitespace-ctrl'
import HTMLToken from './html-token'
import TagToken from './tag-token'
import OutputToken from './output-token'
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
    let line = 1
    let state = ParseState.HTML
    let buffer = ''
    let bufferBegin = 0

    while (p < input.length) {
      if (input[p] === '\n') line++
      const bin = input.substr(p, 2)
      if (state === ParseState.HTML) {
        if (bin === '{{' || bin === '{%') {
          if (buffer) tokens.push(new HTMLToken(buffer, bufferBegin, input, file, line))
          buffer = bin
          bufferBegin = p
          p += 2
          state = bin === '{{' ? ParseState.OUTPUT : ParseState.TAG
          continue
        }
      } else if (state === ParseState.OUTPUT && bin === '}}') {
        buffer += '}}'
        tokens.push(new OutputToken(buffer, bufferBegin, input, file, line))
        p += 2
        buffer = ''
        bufferBegin = p
        state = ParseState.HTML
        continue
      } else if (bin === '%}') {
        buffer += '%}'
        tokens.push(new TagToken(buffer, bufferBegin, input, file, line))
        p += 2
        buffer = ''
        bufferBegin = p
        state = ParseState.HTML
        continue
      }
      buffer += input[p++]
    }
    if (buffer) tokens.push(new HTMLToken(buffer, bufferBegin, input, file, line))

    whiteSpaceCtrl(tokens, this.options)
    return tokens
  }
}
