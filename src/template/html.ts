import Template from '../template/template'
import ITemplate from '../template/itemplate'
import HTMLToken from '../parser/html-token'

export default class extends Template<HTMLToken> implements ITemplate {
  private str: string
  public constructor (token: HTMLToken) {
    super(token)
    this.str = token.value
  }
  public async render (): Promise<string> {
    return this.str
  }
}
