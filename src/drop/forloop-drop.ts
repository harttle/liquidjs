import { Drop } from './drop'

export class ForloopDrop extends Drop {
  protected i: number = 0
  length: number
  constructor (length: number) {
    super()
    this.length = length
  }
  next () {
    this.i++
  }
  index0 () {
    return this.i
  }
  index () {
    return this.i + 1
  }
  first () {
    return this.i === 0
  }
  last () {
    return this.i === this.length - 1
  }
  rindex () {
    return this.length - this.i
  }
  rindex0 () {
    return this.length - this.i - 1
  }
  valueOf () {
    return JSON.stringify(this)
  }
}
