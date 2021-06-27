import { stringify, toValue } from '../util/underscore'

export class Emitter {
  public html: any = '';
  public break = false;
  public continue = false;
  private keepOutputType? = false;

  constructor (keepOutputType: boolean|undefined) {
    this.keepOutputType = keepOutputType
  }

  public write (html: any) {
    if (this.keepOutputType === true) {
      html = toValue(html)
    } else {
      html = stringify(html)
    }
    // This will only preserve the type if the value is isolated.
    // I.E:
    // {{ my-port }} -> 42
    // {{ my-host }}:{{ my-port }} -> 'host:42'
    if (this.keepOutputType === true && typeof html !== 'string' && this.html === '') {
      this.html = html
    } else {
      this.html = stringify(this.html) + stringify(html)
    }
  }
}
