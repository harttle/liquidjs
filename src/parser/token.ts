export default class Token {
  type: string
  line: number
  raw: string
  input: string
  file: string
  value: string
  constructor (raw, pos, input, file, line) {
    this.line = line
    this.raw = raw
    this.input = input
    this.file = file
  }
}
