export default class Token {
  type: string
  line: number
  col: number
  raw: string
  input: string
  file: string
  value: string
  constructor (raw, col, input, file, line) {
    this.col = col
    this.line = line
    this.raw = raw
    this.input = input
    this.file = file
  }
}
