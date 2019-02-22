import Template from 'src/template/template'
import ITemplate from 'src/template/itemplate'
import HTMLToken from 'src/parser/html-token'

export default class extends Template<HTMLToken> implements ITemplate {
  str: string
  constructor (token: HTMLToken) {
    super(token)
    this.str = token.value
  }
  async render (): Promise<string> {
    return this.str
  }
}
