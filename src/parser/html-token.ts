import Token from './token'

export default class HTMLToken extends Token {
  constructor (str: string, input: string, line: number, col: number, file?: string) {
    super(str, input, line, col, file)
    this.type = 'html'
    this.value = str
  }
  static is (token: Token): token is HTMLToken {
    return token.type === 'html'
  }
}
