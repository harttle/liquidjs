import Value from './value'
import { stringify } from 'src/util/underscore'
import Template from 'src/template/template'
import ITemplate from 'src/template/itemplate'
import Scope from 'src/scope/scope'

export default class Output extends Template implements ITemplate {
  value: Value
  constructor(token, strict_filters?) {
    super(token)
    this.value = new Value(token.value, strict_filters)
  }
  async render(scope: Scope) {
    const html = await this.value.value(scope)
    return stringify(html)
  }
}
