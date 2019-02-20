import DelimitedToken from './delimited-token'

export default class OutputToken extends DelimitedToken {
  constructor (raw, value, pos, input, file, line) {
    super(raw, value, pos, input, file, line)
    this.type = 'output'
  }
}
