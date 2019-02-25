import Value from './value'
import { stringify } from '../util/underscore'
import Template from '../template/template'
import ITemplate from '../template/itemplate'
import Scope from '../scope/scope'
import OutputToken from '../parser/output-token'

export default class Output extends Template<OutputToken> implements ITemplate {
  value: Value
  constructor (token: OutputToken, strictFilters: boolean) {
    super(token)
    this.value = new Value(token.value, strictFilters)
  }
  async render (scope: Scope): Promise<string> {
    const html = await this.value.value(scope)
    return stringify(html)
  }
}
