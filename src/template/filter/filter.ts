import assert from 'src/util/assert'
import * as lexical from 'src/parser/lexical'
import { evalValue } from 'src/render/syntax'
import Scope from 'src/scope/scope'
import FilterImpl from './filter-impl'

const valueRE = new RegExp(`${lexical.value.source}`, 'g')

export default class Filter {
  name: string
  impl: FilterImpl
  args: string[]
  private static impls: {[key: string]: FilterImpl} = {}

  constructor (str: string, strictFilters: boolean = false) {
    const match = lexical.filterLine.exec(str) as string[]
    assert(match, 'illegal filter: ' + str)

    const name = match[1]
    const argList = match[2] || ''
    const impl = Filter.impls[name]
    if (!impl && strictFilters) throw new TypeError(`undefined filter: ${name}`)

    this.name = name
    this.impl = impl || (x => x)
    this.args = this.parseArgs(argList)
  }
  parseArgs (argList: string): string[] {
    let match; const args: string[] = []
    while ((match = valueRE.exec(argList.trim()))) {
      const v = match[0]
      const re = new RegExp(`${v}\\s*:`, 'g')
      const keyMatch = re.exec(match.input)
      const currentMatchIsKey = keyMatch && keyMatch.index === match.index
      currentMatchIsKey ? args.push(`'${v}'`) : args.push(v)
    }
    return args
  }
  render (value: any, scope: Scope): any {
    const args = this.args.map(arg => evalValue(arg, scope))
    return this.impl.apply(null, [value, ...args])
  }
  static register (name: string, filter: FilterImpl) {
    Filter.impls[name] = filter
  }
  static clear () {
    Filter.impls = {}
  }
}
