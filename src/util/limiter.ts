import { assert } from './assert'

export class Limiter {
  private message: string
  private base = 0
  private limit: number
  constructor (resource: string, limit: number) {
    this.message = `${resource} limit exceeded`
    this.limit = limit
  }
  use (count: number) {
    assert(this.base + count <= this.limit, this.message)
    this.base += count
  }
  check (count: number) {
    assert(count <= this.limit, this.message)
  }
}
