import { Drop } from './drop'
import { NULL, NullDrop } from './null-drop'

export class ForloopDrop extends Drop {
  protected i = 0
  public name: string
  public length: number
  public parentloop: ForloopDrop | NullDrop
  public constructor (length: number, collection: string, variable: string, parentloop: ForloopDrop|NullDrop = NULL) {
    super()
    this.length = length
    this.name = `${variable}-${collection}`
    this.parentloop = parentloop
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
