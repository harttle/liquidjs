import Token from './token'
import { last } from '../util/underscore'

export default class DelimitedToken extends Token {
  constructor (
    raw: string,
    value: string,
    input: string,
    line: number,
    pos: number,
    trimLeft: boolean,
    trimRight: boolean,
    file?: string
  ) {
    super(raw, input, line, pos, file)
    const tl = value[0] === '-'
    const tr = last(value) === '-'
    this.value = value
      .slice(
        tl ? 1 : 0,
        tr ? -1 : value.length
      )
      .trim()
    this.trimLeft = tl || trimLeft
    this.trimRight = tr || trimRight
  }
}
