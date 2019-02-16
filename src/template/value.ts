import { evalExp } from 'src/render/syntax'
import * as lexical from 'src/parser/lexical'
import assert from 'src/util/assert'
import Filter from './filter'
import Scope from 'src/scope/scope'

export default class {
  initial: any
  filters: Array<any>
  constructor(str: string, strict_filters?: boolean) {
    let match = lexical.matchValue(str)
    assert(match, `illegal value string: ${str}`)

    const initial = match[0]
    str = str.substr(match.index + match[0].length)

    const filters = []
    while ((match = lexical.filter.exec(str))) {
      filters.push([match[0].trim()])
    }

    this.initial = initial
    this.filters = filters.map(str => new Filter(str, strict_filters))
  }
  value(scope: Scope) {
    return this.filters.reduce(
      (prev, filter) => filter.render(prev, scope),
      evalExp(this.initial, scope))
  }
}
