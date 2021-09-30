import { stringify } from '../util/underscore'

export class StreamedEmitter {
  public html: any = '';
  public stream = new (require('stream').PassThrough)()
  public write (html: any) {
    this.stream.write(stringify(html))
  }
  public end () {
    this.stream.end()
  }
}
