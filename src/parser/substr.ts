export class Substr {
  constructor (
    public str: string,
    public begin: number,
    public end: number = begin
  ) {}
  size () {
    return this.end - this.begin
  }
  toString () {
    return this.str.slice(this.begin, this.end)
  }
  first () {
    return this.str[this.begin]
  }
  last () {
    return this.str[this.end - 1]
  }
}
