import { flatten } from './flatten/node'

export class Token {
  public trimLeft = false
  public trimRight = false
  public type = 'notset'
  public raw: string
  public content: string
  public constructor (raw: string,
    public input: string,
    public line: number,
    public col: number,
    public file?: string
  ) {
    this.raw = flatten(raw)
    this.content = raw
  }
}
