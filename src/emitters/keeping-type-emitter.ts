import { Limiter, stringify, toValue } from '../util'
import { Emitter } from './emitter'

export class KeepingTypeEmitter implements Emitter {
  public buffer: any = '';

  public constructor (private memoryLimit?: Limiter) {}

  public write (html: any) {
    html = toValue(html)
    // This will only preserve the type if the value is isolated.
    // I.E:
    // {{ my-port }} -> 42
    // {{ my-host }}:{{ my-port }} -> 'host:42'
    if (typeof html !== 'string' && this.buffer === '') {
      this.memoryLimit?.use(stringify(html).length)
      this.buffer = html
    } else {
      const str = stringify(html)
      this.memoryLimit?.use(str.length)
      this.buffer = stringify(this.buffer) + str
    }
  }
}
