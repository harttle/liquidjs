import Token from './token'
import { last } from 'src/util/underscore'

export default class DelimitedToken extends Token {
  trimLeft: boolean
  trimRight: boolean
  constructor (raw: string, value: string, input: string, line: number, pos: number, file?: string) {
    super(raw, input, line, pos, file)
    this.trimLeft = value[0] === '-'
    this.trimRight = last(value) === '-'
    this.value = value
      .slice(
        this.trimLeft ? 1 : 0,
        this.trimRight ? -1 : value.length
      )
      .trim()
  }
}
