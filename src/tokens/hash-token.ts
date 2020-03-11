import { Token } from './token'
import { ValueToken } from './value-token'
import { WordToken } from './word-token'
import { TokenKind } from '../parser/token-kind'

export class HashToken extends Token {
  constructor (
    public input: string,
    public begin: number,
    public end: number,
    public name: WordToken,
    public value?: ValueToken,
    public file?: string
  ) {
    super(TokenKind.Hash, input, begin, end, file)
  }
}
