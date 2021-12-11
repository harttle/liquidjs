import { stringify } from '../util/underscore'
import { Emitter } from './emitter'

export class StreamedEmitter implements Emitter {
  public buffer = '';
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  public stream: NodeJS.ReadWriteStream = new (require('stream').PassThrough)()
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
