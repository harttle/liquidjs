import DelimitedToken from './delimited-token'
import { TokenizationError } from '../util/error'
import * as lexical from './lexical'

export default class TagToken extends DelimitedToken {
  name: string
  args: string
  constructor (raw: string, value: string, input: string, line: number, pos: number, file?: string) {
    super(raw, value, input, line, pos, file)
    this.type = 'tag'
    const match = this.value.match(lexical.tagLine)
    if (!match) {
      throw new TokenizationError(`illegal tag syntax`, this)
    }
    this.name = match[1]
    this.args = match[2]
  }
}
