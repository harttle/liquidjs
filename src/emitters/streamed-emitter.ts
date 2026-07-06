import { stringify } from '../util'
import { Emitter } from './emitter'
import { PassThrough } from 'stream'

export class StreamedEmitter implements Emitter {
  public buffer = '';
  public stream: NodeJS.ReadWriteStream = new PassThrough()
  public write (html: any) {
    this.stream.write(stringify(html))
  }
  public error (err: Error) {
    this.stream.emit('error', err)
  }
  public end () {
    this.stream.end()
  }
}
