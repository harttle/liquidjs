import Token from 'src/parser/token'
import ITemplate from 'src/template/itemplate'

type parseToken = (token: Token, remainTokens: Array<Token>) => ITemplate
type eventHandler = ((arg?: Token | ITemplate) => void)

export default class ParseStream {
  private tokens: Array<Token>
  private handlers: {[key: string]: eventHandler} = {}
  private stopRequested: boolean
  private parseToken: parseToken

  constructor (tokens: Array<Token>, parseToken: parseToken) {
    this.tokens = tokens
    this.parseToken = parseToken
  }
  on (name: string, cb: eventHandler) {
    this.handlers[name] = cb
    return this
  }
  trigger (event: string, arg?: Token | ITemplate) {
    const h = this.handlers[event]
    if (typeof h === 'function') {
      h(arg)
      return true
    }
  }
  start () {
    this.trigger('start')
    let token
    while (!this.stopRequested && (token = this.tokens.shift())) {
      if (this.trigger('token', token)) continue
      if (token.type === 'tag' &&
          this.trigger(`tag:${token.name}`, token)) {
        continue
      }
      const template = this.parseToken(token, this.tokens)
      this.trigger('template', template)
    }
    if (!this.stopRequested) this.trigger('end')
    return this
  }
  stop () {
    this.stopRequested = true
    return this
  }
}
