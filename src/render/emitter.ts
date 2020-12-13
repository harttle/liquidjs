export class Emitter {
  public html: any = '';
  public break = false;
  public continue = false;
  private keepOutputType? = false;

  constructor (keepOutputType: boolean|undefined) {
    this.keepOutputType = keepOutputType
  }

  public write (html: any) {
    if (this.keepOutputType && typeof html !== 'string') {
      this.html = html
    } else {
      this.html += html as string
    }
  }
}
