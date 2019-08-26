import { Drop } from './drop'

export class ForloopDrop extends Drop {
  protected i = 0
  public length: number
  public constructor (length: number) {
    super()
    this.length = length
  }
  public next () {
    this.i++
  }
  public index0 () {
    return this.i
  }
  public index () {
    return this.i + 1
  }
  public first () {
    return this.i === 0
  }
  public last () {
    return this.i === this.length - 1
  }
  public rindex () {
    return this.length - this.i
  }
  public rindex0 () {
    return this.length - this.i - 1
  }
  public valueOf () {
    return JSON.stringify(this)
  }
}
