import { stringify } from '../util/underscore'
import { Emitter } from './emitter'

export class SimpleEmitter implements Emitter {
  public html: any = '';

  public write (html: any) {
    this.html += stringify(html)
  }

  public end () {
    return this.html
  }
}
