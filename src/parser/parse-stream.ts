import { Token } from '../parser/token'
import { ITemplate } from '../template/itemplate'
import { TagToken } from './tag-token'

type ParseToken = ((token: Token, remainTokens: Token[]) => ITemplate)

export class ParseStream {
  private tokens: Token[]
  private handlers: {[key: string]: (arg: any) => void} = {}
  private stopRequested = false
  private parseToken: ParseToken

  public constructor (tokens: Token[], parseToken: ParseToken) {
    this.tokens = tokens
    this.parseToken = parseToken
  }
  public on<T extends ITemplate | Token | undefined> (name: string, cb: (arg: T) => void): ParseStream {
    this.handlers[name] = cb
    return this
  }
  private trigger <T extends Token | ITemplate> (event: string, arg?: T) {
    const h = this.handlers[event]
    return h ? (h(arg), true) : false
  }
  public start () {
    this.trigger('start')
    let token: Token | undefined
    while (!this.stopRequested && (token = this.tokens.shift())) {
      if (this.trigger('token', token)) continue
      if (TagToken.is(token) && this.trigger(`tag:${token.name}`, token)) {
        continue
      }
      const template = this.parseToken(token, this.tokens)
      this.trigger('template', template)
    }
    if (!this.stopRequested) this.trigger('end')
    return this
  }
  public stop () {
    this.stopRequested = true
    return this
  }
}
