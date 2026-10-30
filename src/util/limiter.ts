import { assert } from './assert'

export class Limiter {
  public readonly unlimited: boolean
  private message: string
  private base = 0
  private limit: number
  constructor (resource: string, limit: number) {
    this.message = `${resource} limit exceeded`
    this.limit = limit
    this.unlimited = limit === Infinity
  }
  use (count: number) {
    if (+count > 0) {
      assert(this.base + +count <= this.limit, this.message)
      this.base += +count
    }
  }
  check (count: number) {
    if (+count > 0) {
      assert(+count <= this.limit, this.message)
    }
  }
}
