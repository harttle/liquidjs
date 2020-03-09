export class Token {
  public trimLeft = false
  public trimRight = false
  public content: string
  public constructor (
    public raw: string,
    public input: string,
    public line: number,
    public col: number,
    public file?: string
  ) {
    this.content = raw
  }
}
