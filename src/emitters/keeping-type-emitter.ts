import { stringify, toValue } from '../util/underscore'

export class KeepingTypeEmitter {
  public html: any = '';

  public write (html: any) {
    html = toValue(html)
    // This will only preserve the type if the value is isolated.
    // I.E:
    // {{ my-port }} -> 42
    // {{ my-host }}:{{ my-port }} -> 'host:42'
    if (typeof html !== 'string' && this.html === '') {
      this.html = html
    } else {
      this.html = stringify(this.html) + stringify(html)
    }
  }

  public end () {
    return this.html
  }
}
