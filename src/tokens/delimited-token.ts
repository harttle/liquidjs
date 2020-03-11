import { Token } from './token'
import { TokenKind } from '../parser/token-kind'
import { last } from '../util/underscore'

export abstract class DelimitedToken extends Token {
  public trimLeft = false
  public trimRight = false
  public content: string
  public constructor (
    kind: TokenKind,
    content: string,
    input: string,
    begin: number,
    end: number,
    trimLeft: boolean,
    trimRight: boolean,
    file?: string
  ) {
    super(kind, input, begin, end, file)
    this.content = this.getText()
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
