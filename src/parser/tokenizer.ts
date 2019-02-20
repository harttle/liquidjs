import whiteSpaceCtrl from './whitespace-ctrl'
import HTMLToken from './html-token'
import TagToken from './tag-token'
import Token from './token'
import OutputToken from './output-token'
import { TokenizationError } from 'src/util/error'
import { NormalizedFullOptions, applyDefault } from '../liquid-options'

enum ParseState { HTML, OUTPUT, TAG }

export default class Tokenizer {
  options: NormalizedFullOptions
  constructor (options?: NormalizedFullOptions) {
    this.options = applyDefault(options)
  }
  tokenize (input: string, file?: string) {
    const tokens = []
    const tagL = this.options.tag_delimiter_left
    const tagR = this.options.tag_delimiter_right
    const outputL = this.options.output_delimiter_left
    const outputR = this.options.output_delimiter_right
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
      if (state === ParseState.HTML) {
        if (input.substr(p, outputL.length) === outputL) {
          if (buffer) tokens.push(new HTMLToken(buffer, col, input, file, line))
          buffer = outputL
          line = curLine
          col = p - lineBegin + 1
          p += outputL.length
          state = ParseState.OUTPUT
          continue
        } else if (input.substr(p, tagL.length) === tagL) {
          if (buffer) tokens.push(new HTMLToken(buffer, col, input, file, line))
          buffer = tagL
          line = curLine
          col = p - lineBegin + 1
          p += tagL.length
          state = ParseState.TAG
          continue
        }
      } else if (state === ParseState.OUTPUT && input.substr(p, outputR.length) === outputR) {
        buffer += outputR
        tokens.push(new OutputToken(buffer, buffer.slice(outputL.length, -outputR.length), col, input, file, line))
        p += outputR.length
        buffer = ''
        line = curLine
        col = p - lineBegin + 1
        state = ParseState.HTML
        continue
      } else if (input.substr(p, tagR.length) === tagR) {
        buffer += tagR
        tokens.push(new TagToken(buffer, buffer.slice(tagL.length, -tagR.length), col, input, file, line))
        p += tagR.length
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
