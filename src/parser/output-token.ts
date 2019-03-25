import DelimitedToken from './delimited-token'
import Token from './token'
import { NormalizedFullOptions } from '../liquid-options'

export default class OutputToken extends DelimitedToken {
  constructor (
    raw: string,
    value: string,
    input: string,
    line: number,
    pos: number,
    options: NormalizedFullOptions,
    file?: string
  ) {
    super(raw, value, input, line, pos, options.trimOutputLeft, options.trimOutputRight, file)
    this.type = 'output'
  }
  static is (token: Token): token is OutputToken {
    return token.type === 'output'
  }
}
