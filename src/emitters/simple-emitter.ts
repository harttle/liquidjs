import { Limiter, stringify } from '../util'
import { Emitter } from './emitter'

export class SimpleEmitter implements Emitter {
  public buffer = '';

  public constructor (private memoryLimit?: Limiter) {}

  public write (html: any) {
    const str = stringify(html)
    this.memoryLimit?.use(str.length)
    this.buffer += str
  }
}
