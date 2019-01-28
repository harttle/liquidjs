import * as lexical from './lexical.js'
import { evalValue } from './syntax.js'
import assert from './util/assert.js'
import { assign, create } from './util/underscore.js'

const valueRE = new RegExp(`${lexical.value.source}`, 'g')

export default function (options) {
  options = assign({}, options)
  let filters = {}

  const _filterInstance = {
    render: function (output, scope) {
      const args = this.args.map(arg => evalValue(arg, scope))
      args.unshift(output)
      return this.filter.apply(null, args)
    },
    parse: function (str) {
      let match = lexical.filterLine.exec(str)
      assert(match, 'illegal filter: ' + str)

      const name = match[1]
      const argList = match[2] || ''
      const filter = filters[name]
      if (typeof filter !== 'function') {
        if (options.strict_filters) {
          throw new TypeError(`undefined filter: ${name}`)
        }
        this.name = name
        this.filter = x => x
        this.args = []
        return this
      }

      const args = []
      while ((match = valueRE.exec(argList.trim()))) {
        const v = match[0]
        const re = new RegExp(`${v}\\s*:`, 'g')
        const keyMatch = re.exec(match.input)
        const currentMatchIsKey = keyMatch && keyMatch.index === match.index
        currentMatchIsKey ? args.push(`'${v}'`) : args.push(v)
      }

      this.name = name
      this.filter = filter
      this.args = args

      return this
    }
  }

  function construct (str) {
    const instance = create(_filterInstance)
    return instance.parse(str)
  }

  function register (name, filter) {
    filters[name] = filter
  }

  function clear () {
    filters = {}
  }

  return {
    construct, register, clear
  }
}
