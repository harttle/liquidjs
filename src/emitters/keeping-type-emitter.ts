import { stringify, toValue } from '../util/underscore'
import { Emitter } from '../types'

export class KeepingTypeEmitter implements Emitter {
  public buffer: any = '';

  public write (html: any) {
    html = toValue(html)
    // This will only preserve the type if the value is isolated.
    // I.E:
    // {{ my-port }} -> 42
    // {{ my-host }}:{{ my-port }} -> 'host:42'
    if (typeof html !== 'string' && this.buffer === '') {
      this.buffer = html
    } else {
      this.buffer = stringify(this.buffer) + stringify(html)
    }
  }
}
