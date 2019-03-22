import Value from './value'
import { stringify } from '../util/underscore'
import Template from '../template/template'
import ITemplate from '../template/itemplate'
import Context from '../context/context'
import OutputToken from '../parser/output-token'

export default class Output extends Template<OutputToken> implements ITemplate {
  value: Value
  constructor (token: OutputToken, strictFilters: boolean) {
    super(token)
    this.value = new Value(token.value, strictFilters)
  }
  async render (ctx: Context): Promise<string> {
    const html = await this.value.value(ctx)
    return stringify(html)
  }
}
