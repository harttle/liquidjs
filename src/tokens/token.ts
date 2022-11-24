import { TokenKind } from '../parser'

export abstract class Token {
  public constructor (
    public kind: TokenKind,
    public input: string,
    public begin: number,
    public end: number,
    public file?: string
  ) {}
  public getText () {
    return this.input.slice(this.begin, this.end)
  }
  public getPosition () {
    let [row, col] = [1, 1]
    for (let i = 0; i < this.begin; i++) {
      if (this.input[i] === '\n') {
        row++
        col = 1
      } else col++
    }
    return [row, col]
  }
  public size () {
    return this.end - this.begin
  }
}
