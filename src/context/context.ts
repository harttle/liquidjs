import * as _ from '../util/underscore'
import { Drop } from '../drop/drop'
import { __assign } from 'tslib'
import assert from '../util/assert'
import { NormalizedFullOptions, applyDefault } from '../liquid-options'
import { Scope } from './scope'

export default class Context {
  opts: NormalizedFullOptions
  environments: Scope
  private scopes: Array<Scope> = [{}]
  private registers = {}
  constructor (ctx: object = {}, opts?: NormalizedFullOptions) {
    this.opts = applyDefault(opts)
    this.environments = ctx
  }
  getRegister (key: string, defaultValue = {}) {
    return (this.registers[key] = this.registers[key] || defaultValue)
  }
  setRegister (key: string, value: any) {
    return (this.registers[key] = value)
  }
  getAll () {
    return [this.environments, ...this.scopes]
      .reduce((ctx, val) => __assign(ctx, val), {})
  }
  async get (path: string) {
    const paths = await this.parseProp(path)
    let ctx = this.findScope(paths[0]) || this.environments
    for (const path of paths) {
      ctx = readProperty(ctx, path)
      if (_.isNil(ctx) && this.opts.strictVariables) {
        throw new TypeError(`undefined variable: ${path}`)
      }
    }
    return ctx
  }
  push (ctx: object) {
    return this.scopes.push(ctx)
  }
  pop () {
    return this.scopes.pop()
  }
  front () {
    return this.scopes[0]
  }
  private findScope (key: string) {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      const candidate = this.scopes[i]
      if (key in candidate) {
        return candidate
      }
    }
    return null
  }

  /*
   * Parse property access sequence from access string
   * @example
   * accessSeq("foo.bar")         // ['foo', 'bar']
   * accessSeq("foo['bar']")      // ['foo', 'bar']
   * accessSeq("foo['b]r']")      // ['foo', 'b]r']
   * accessSeq("foo[bar.coo]")    // ['foo', 'bar'], for bar.coo == 'bar'
   */
  private async parseProp (str: string) {
    str = String(str)
    const seq: string[] = []
    let name = ''
    let j
    let i = 0
    while (i < str.length) {
      switch (str[i]) {
        case '[':
          push()

          const delemiter = str[i + 1]
          if (/['"]/.test(delemiter)) { // foo["bar"]
            j = str.indexOf(delemiter, i + 2)
            assert(j !== -1, `unbalanced ${delemiter}: ${str}`)
            name = str.slice(i + 2, j)
            push()
            i = j + 2
          } else { // foo[bar.coo]
            j = matchRightBracket(str, i + 1)
            assert(j !== -1, `unbalanced []: ${str}`)
            name = str.slice(i + 1, j)
            if (!/^[+-]?\d+$/.test(name)) { // foo[bar] vs. foo[1]
              name = String(await this.get(name))
            }
            push()
            i = j + 1
          }
          break
        case '.':// foo.bar, foo[0].bar
          push()
          i++
          break
        default:// foo.bar
          name += str[i++]
      }
    }
    push()

    if (!seq.length) {
      throw new TypeError(`invalid path:"${str}"`)
    }
    return seq

    function push () {
      if (name.length) seq.push(name)
      name = ''
    }
  }
}

function readProperty (obj: Scope, key: string) {
  if (_.isNil(obj)) return obj
  obj = _.toLiquid(obj)
  if (obj instanceof Drop) {
    if (_.isFunction(obj[key])) return obj[key]()
    if (obj.hasOwnProperty(key)) return obj[key]
    return obj.liquidMethodMissing(key)
  }
  return key === 'size' ? readSize(obj) : obj[key]
}

function readSize (obj: Scope) {
  if (!_.isNil(obj['size'])) return obj['size']
  if (_.isArray(obj) || _.isString(obj)) return obj.length
  return obj['size']
}

function matchRightBracket (str: string, begin: number) {
  let stack = 1 // count of '[' - count of ']'
  for (let i = begin; i < str.length; i++) {
    if (str[i] === '[') {
      stack++
    }
    if (str[i] === ']') {
      stack--
      if (stack === 0) {
        return i
      }
    }
  }
  return -1
}
