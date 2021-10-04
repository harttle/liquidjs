import { ForloopDrop } from './forloop-drop'

export class TablerowloopDrop extends ForloopDrop {
  private cols: number
  public constructor (length: number, cols: number, collection: string, variable: string) {
    super(length, collection, variable)
    this.length = length
    this.cols = cols
  }
  public row () {
    return Math.floor(this.i / this.cols) + 1
  }
  public col0 () {
    return (this.i % this.cols)
  }
  public col () {
    return this.col0() + 1
  }
  public col_first () {  // eslint-disable-line
    return this.col0() === 0
  }
  public col_last () { // eslint-disable-line
    return this.col() === this.cols
  }
}
