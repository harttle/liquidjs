export class Token {
  public trimLeft: boolean = false
  public trimRight: boolean = false
  public type: string = 'notset'
  public line: number
  public col: number
  public raw: string
  public input: string
  public file?: string
  public value: string
  public constructor (raw: string, input: string, line: number, col: number, file?: string) {
    this.col = col
    this.line = line
    this.raw = raw
    this.value = raw
    this.input = input
    this.file = file
  }
}
