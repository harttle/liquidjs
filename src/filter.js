const lexical = require('./lexical.js')
const Syntax = require('./syntax.js')
const assert = require('./util/assert.js')
const _ = require('./util/underscore.js')

let valueRE = new RegExp(`${lexical.value.source}`, 'g')

module.exports = function (options) {
  options = _.assign({}, options)
  let filters = {}

  let _filterInstance = {
    render: function (output, scope) {
      let args = this.args.map(arg => Syntax.evalValue(arg, scope))
      args.unshift(output)
      return this.filter.apply(null, args)
    },
    parse: function (str) {
      let match = lexical.filterLine.exec(str)
      assert(match, 'illegal filter: ' + str)

      let name = match[1]
      let argList = match[2] || ''
      let filter = filters[name]
      if (typeof filter !== 'function') {
        if (options.strict_filters) {
          throw new TypeError(`undefined filter: ${name}`)
        }
        this.name = name
        this.filter = x => x
        this.args = []
        return this
      }

      let args = []
      while ((match = valueRE.exec(argList.trim()))) {
        let v = match[0]
        let re = new RegExp(`${v}\\s*:`, 'g')
        let keyMatch = re.exec(match.input)
        let currentMatchIsKey = keyMatch && keyMatch.index === match.index
        currentMatchIsKey ? args.push(`'${v}'`) : args.push(v)
      }

      this.name = name
      this.filter = filter
      this.args = args

      return this
    }
  }

  function construct (str) {
    let instance = Object.create(_filterInstance)
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
