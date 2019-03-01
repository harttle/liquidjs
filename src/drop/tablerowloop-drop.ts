import { ForloopDrop } from './forloop-drop'

export class TablerowloopDrop extends ForloopDrop {
  private cols: number
  constructor (length: number, cols: number) {
    super(length)
    this.length = length
    this.cols = cols
  }
  row () {
    return Math.floor(this.i / this.cols) + 1
  }
  col0 () {
    return (this.i % this.cols)
  }
  col () {
    return this.col0() + 1
  }
  col_first () {  // eslint-disable-line
    return this.col0() === 0
  }
  col_last () { // eslint-disable-line
    return this.col() === this.cols
  }
}
