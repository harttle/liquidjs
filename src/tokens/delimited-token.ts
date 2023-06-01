import { Token } from './token'
import { TokenKind } from '../parser'
import { TYPES, BLANK } from '../util'

export abstract class DelimitedToken extends Token {
  public trimLeft = false
  public trimRight = false
  public contentRange: [number, number]
  public constructor (
    kind: TokenKind,
    [contentBegin, contentEnd]: [number, number],
    input: string,
    begin: number,
    end: number,
    trimLeft: boolean,
    trimRight: boolean,
    file?: string
  ) {
    super(kind, input, begin, end, file)
    const tl = input[contentBegin] === '-'
    const tr = input[contentEnd - 1] === '-'

    let l = tl ? contentBegin + 1 : contentBegin
    let r = tr ? contentEnd - 1 : contentEnd
    while (l < r && (TYPES[input.charCodeAt(l)] & BLANK)) l++
    while (r > l && (TYPES[input.charCodeAt(r - 1)] & BLANK)) r--

    this.contentRange = [l, r]
    this.trimLeft = tl || trimLeft
    this.trimRight = tr || trimRight
  }
  get content () {
    return this.input.slice(this.contentRange[0], this.contentRange[1])
  }
}
