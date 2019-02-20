import Token from './token'

export default class DelimitedToken extends Token {
  trimLeft: boolean
  trimRight: boolean
  constructor (raw, value, pos, input, file, line) {
    super(raw, pos, input, file, line)
    this.trimLeft = value[0] === '-'
    this.trimRight = value[value.length - 1] === '-'
    this.value = value
      .slice(
        this.trimLeft ? 1 : 0,
        this.trimRight ? -1 : value.length
      )
      .trim()
  }
}
