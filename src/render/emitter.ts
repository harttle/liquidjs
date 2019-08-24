export class Emitter {
  public html: string = '';

  public write (html: string) {
    this.html += html
  }
}
