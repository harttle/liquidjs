import { Token } from './token'
import { last } from '../util/underscore'

export class DelimitedToken extends Token {
  public constructor (
    raw: string,
    content: string,
    input: string,
    line: number,
    pos: number,
    trimLeft: boolean,
    trimRight: boolean,
    file?: string
  ) {
    super(raw, input, line, pos, file)
    const tl = content[0] === '-'
    const tr = last(content) === '-'
    this.content = content
      .slice(
        tl ? 1 : 0,
        tr ? -1 : content.length
      )
      .trim()
    this.trimLeft = tl || trimLeft
    this.trimRight = tr || trimRight
  }
}
