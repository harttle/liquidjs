import Token from './token'

export default class HTMLToken extends Token {
  constructor (str, begin, input, file, line) {
    super(str, begin, input, file, line)
    this.type = 'html'
    this.value = str
  }
}
