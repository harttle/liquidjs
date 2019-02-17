import DelimitedToken from './delimited-token'

export default class OutputToken extends DelimitedToken {
  constructor (raw, pos, input, file, line) {
    super(raw, pos, input, file, line)
    this.type = 'output'
  }
}
