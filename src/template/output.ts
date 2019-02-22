import Value from './value'
import { stringify } from 'src/util/underscore'
import Template from 'src/template/template'
import ITemplate from 'src/template/itemplate'
import Scope from 'src/scope/scope'
import OutputToken from 'src/parser/output-token'

export default class Output extends Template<OutputToken> implements ITemplate {
  value: Value
  constructor (token: OutputToken, strictFilters?: boolean) {
    super(token)
    this.value = new Value(token.value, strictFilters)
  }
  async render (scope: Scope): Promise<string> {
    const html = await this.value.value(scope)
    return stringify(html)
  }
}
