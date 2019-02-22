import { evalExp } from 'src/render/syntax'
import * as lexical from 'src/parser/lexical'
import assert from 'src/util/assert'
import Filter from './filter/filter'
import Scope from 'src/scope/scope'

export default class {
  initial: any
  filters: Array<Filter> = []
  constructor (str: string, strictFilters?: boolean) {
    let match: RegExpExecArray | null = lexical.matchValue(str) as RegExpExecArray
    assert(match, `illegal value string: ${str}`)

    this.initial = match[0]
    str = str.substr(match.index + match[0].length)

    while ((match = lexical.filter.exec(str))) {
      this.filters.push(new Filter(match[0].trim(), strictFilters))
    }
  }
  value (scope: Scope) {
    return this.filters.reduce(
      (prev, filter) => filter.render(prev, scope),
      evalExp(this.initial, scope))
  }
}
