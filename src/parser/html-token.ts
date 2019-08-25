import { Token } from './token'

export class HTMLToken extends Token {
  public constructor (str: string, input: string, line: number, col: number, file?: string) {
    super(str, input, line, col, file)
    this.type = 'html'
    this.value = str
  }
  public static is (token: Token): token is HTMLToken {
    return token.type === 'html'
  }
}
