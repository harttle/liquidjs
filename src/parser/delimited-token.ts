import Token from './token'

export default class DelimitedToken extends Token {
  trimLeft: boolean
  trimRight: boolean
  constructor (raw, pos, input, file, line) {
    super(raw, pos, input, file, line)
    this.trimLeft = raw[2] === '-'
    this.trimRight = raw[raw.length - 3] === '-'
    this.value = raw.slice(this.trimLeft ? 3 : 2, this.trimRight ? -3 : -2).trim()
  }
}
