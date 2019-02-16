import assert from 'src/util/assert'
import * as lexical from 'src/parser/lexical'
import { evalValue } from 'src/render/syntax'
import Scope from 'src/scope/scope'

type impl = (value: any, ...args: any[]) => any

const valueRE = new RegExp(`${lexical.value.source}`, 'g')

export default class Filter {
  name: string
  impl: impl
  args: string[]
  private static impls: {[key: string]: impl} = {}

  constructor (str: string, strict_filters: boolean = false) {
    let match = lexical.filterLine.exec(str)
    assert(match, 'illegal filter: ' + str)

    const name = match[1]
    const argList = match[2] || ''
    const impl = Filter.impls[name]
    if (!impl && strict_filters) throw new TypeError(`undefined filter: ${name}`)

    this.name = name
    this.impl = impl || (x => x)
    this.args = this.parseArgs(argList)
  }
  parseArgs (argList: string): string[] {
    let match, args = []
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
    args.unshift(value)
    return this.impl.apply(null, args)
  }
  static register(name, filter) {
    Filter.impls[name] = filter
  }
  static clear () {
    Filter.impls = {}
  }
}
