import DelimitedToken from './delimited-token'

export default class OutputToken extends DelimitedToken {
  constructor (raw: string, value: string, input: string, line: number, pos: number, file?: string) {
    super(raw, value, input, line, pos, file)
    this.type = 'output'
  }
}
