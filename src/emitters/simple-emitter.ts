import { stringify, Limiter } from '../util'
import { Emitter } from './emitter'

export class SimpleEmitter implements Emitter {
  public buffer = '';
  private outputLengthLimit?: Limiter

  constructor (outputLengthLimit?: Limiter) {
    this.outputLengthLimit = outputLengthLimit
  }

  public write (html: any) {
    const str = stringify(html)
    this.outputLengthLimit?.use(str.length)
    this.buffer += str
  }
}
