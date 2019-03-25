export default class Token {
  trimLeft: boolean = false
  trimRight: boolean = false
  type: string = 'notset'
  line: number
  col: number
  raw: string
  input: string
  file?: string
  value: string
  constructor (raw: string, input: string, line: number, col: number, file?: string) {
    this.col = col
    this.line = line
    this.raw = raw
    this.value = raw
    this.input = input
    this.file = file
  }
}
