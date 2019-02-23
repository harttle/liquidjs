import * as _ from '../util/underscore'
import { __assign } from 'tslib'
import assert from '../util/assert'
import { NormalizedFullOptions, applyDefault } from '../liquid-options'
import BlockMode from './block-mode'
import IContext from './icontext'

export default class Scope {
  opts: NormalizedFullOptions
  contexts: Array<IContext>
  blocks: object = {}
  groups: {[key: string]: number} = {}
  blockMode: BlockMode = BlockMode.OUTPUT
  constructor (ctx: object = {}, opts?: NormalizedFullOptions) {
    this.opts = applyDefault(opts)
    this.contexts = [ctx || {}]
  }
  getAll () {
    return this.contexts.reduce((ctx, val) => __assign(ctx, val), {})
  }
  get (path: string): any {
    const paths = this.propertyAccessSeq(path)
    const scope = this.findContextFor(paths[0]) || _.last(this.contexts)
    return paths.reduce((value, key) => this.readProperty(value, key), scope)
  }
  set (path: string, v: any): void {
    const paths = this.propertyAccessSeq(path)
    let scope = this.findContextFor(paths[0]) || _.last(this.contexts)
    paths.some((key, i) => {
      if (!_.isObject(scope)) {
        return true
      }
      if (i === paths.length - 1) {
        scope[key] = v
        return true
      }
      if (undefined === scope[key]) {
        scope[key] = {}
      }
      scope = scope[key]
      return false
    })
  }
  unshift (ctx: object) {
    return this.contexts.unshift(ctx)
  }
  push (ctx: object) {
    return this.contexts.push(ctx)
  }
  pop (ctx?: object): object | undefined {
    if (!arguments.length) {
      return this.contexts.pop()
    }
    const i = this.contexts.findIndex(scope => scope === ctx)
    if (i === -1) {
      throw new TypeError('scope not found, cannot pop')
    }
    return this.contexts.splice(i, 1)[0]
  }
  findContextFor (key: string, filter: ((conttext: object) => boolean) = () => true) {
    for (let i = this.contexts.length - 1; i >= 0; i--) {
      const candidate = this.contexts[i]
      if (!filter(candidate)) continue
      if (key in candidate) {
        return candidate
      }
    }
    return null
  }
  private readProperty (obj: IContext, key: string) {
    let val
    if (_.isNil(obj)) {
      val = undefined
    } else {
      obj = toLiquid(obj)
      val = key === 'size' ? readSize(obj) : obj[key]
      if (_.isFunction(obj.liquid_method_missing)) {
        val = obj.liquid_method_missing!(key)
      }
    }
    if (_.isNil(val) && this.opts.strict_variables) {
      throw new TypeError(`undefined variable: ${key}`)
    }
    return val
  }

  /*
   * Parse property access sequence from access string
   * @example
   * accessSeq("foo.bar")            // ['foo', 'bar']
   * accessSeq("foo['bar']")      // ['foo', 'bar']
   * accessSeq("foo['b]r']")      // ['foo', 'b]r']
   * accessSeq("foo[bar.coo]")    // ['foo', 'bar'], for bar.coo == 'bar'
   */
  propertyAccessSeq (str: string) {
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
              name = String(this.get(name))
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
          name += str[i]
          i++
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

function toLiquid (obj: IContext) {
  if (_.isFunction(obj.to_liquid)) {
    return obj.to_liquid()
  }
  if (_.isFunction(obj.toLiquid)) {
    return obj.toLiquid()
  }
  return obj
}

function readSize (obj: IContext) {
  if (!_.isNil(obj.size)) return obj.size
  if (_.isArray(obj) || _.isString(obj)) return obj.length
  return obj.size
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
