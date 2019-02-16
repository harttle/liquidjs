import Token from './token'

export default class DelimitedToken extends Token {
  trim_left: boolean
  trim_right: boolean
  constructor(raw, pos, input, file, line) {
    super(raw, pos, input, file, line)
    this.trim_left = raw[2] === '-'
    this.trim_right = raw[raw.length - 3] === '-'
    this.value = raw.slice(this.trim_left ? 3 : 2, this.trim_right ? -3 : -2).trim()
  }
}
