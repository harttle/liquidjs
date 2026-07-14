import { stringify, Limiter } from '../util'
import { Emitter } from './emitter'
import { PassThrough } from 'stream'

export class StreamedEmitter implements Emitter {
  public buffer = '';
  public stream: NodeJS.ReadWriteStream = new PassThrough()
  private outputLengthLimit?: Limiter

  constructor (outputLengthLimit?: Limiter) {
    this.outputLengthLimit = outputLengthLimit
  }

  public write (html: any) {
    const str = stringify(html)
    this.outputLengthLimit?.use(str.length)
    this.stream.write(str)
  }
  public error (err: Error) {
    this.stream.emit('error', err)
  }
  public end () {
    this.stream.end()
  }
}
