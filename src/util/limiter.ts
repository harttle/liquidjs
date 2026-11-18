import { assert } from './assert'
import { getPerformance } from './performance'

export class Limiter {
  private message: string
  private base = 0
  protected limit: number
  constructor (resource: string, limit: number) {
    this.message = `${resource} limit exceeded`
    this.limit = limit
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

export class TimeLimiter extends Limiter {
  check (now?: number) {
    if (this.limit !== Infinity) super.check(now ?? getPerformance().now())
  }
}
