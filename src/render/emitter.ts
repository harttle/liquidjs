export class Emitter {
  public html = '';
  public break = false;
  public continue = false;

  public write (html: string) {
    this.html += html
  }
}
