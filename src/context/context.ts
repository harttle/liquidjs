import { Drop } from '../drop/drop'
import { __assign } from 'tslib'
import { assert } from '../util/assert'
import { NormalizedFullOptions, defaultOptions } from '../liquid-options'
import { Scope } from './scope'
import { isArray, isNil, isString, isFunction, toLiquid } from '../util/underscore'

export class Context {
  private scopes: Scope[] = [{}]
  private registers = {}
  public environments: Scope
  public globals: Scope
  public sync: boolean
  public opts: NormalizedFullOptions
  public constructor (env: object = {}, opts: NormalizedFullOptions = defaultOptions, sync = false) {
    this.sync = sync
    this.opts = opts
    this.globals = opts.globals
    this.environments = env
  }
  public getRegister (key: string, defaultValue = {}) {
    return (this.registers[key] = this.registers[key] || defaultValue)
  }
  public setRegister (key: string, value: any) {
    return (this.registers[key] = value)
  }
  public saveRegister (...keys: string[]): [string, any][] {
    return keys.map(key => [key, this.getRegister(key)])
  }
  public restoreRegister (keyValues: [string, any][]) {
    return keyValues.forEach(([key, value]) => this.setRegister(key, value))
  }
  public getAll () {
    return [this.globals, this.environments, ...this.scopes]
      .reduce((ctx, val) => __assign(ctx, val), {})
  }
  public get (path: string) {
    const paths = this.parseProp(path)
    const scope = this.findScope(paths[0])
    return this.getFromScope(scope, paths)
  }
  public getFromScope (scope: object, paths: string[] | string) {
    if (!isArray(paths)) paths = this.parseProp(paths)
    return paths.reduce((scope, path) => {
      scope = readProperty(scope, path)
      if (isNil(scope) && this.opts.strictVariables) {
        throw new TypeError(`undefined variable: ${path}`)
      }
      return scope
    }, scope)
  }
  public push (ctx: object) {
    return this.scopes.push(ctx)
  }
  public pop () {
    return this.scopes.pop()
  }
  public bottom () {
    return this.scopes[0]
  }
  private findScope (key: string) {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      const candidate = this.scopes[i]
      if (key in candidate) {
        return candidate
      }
    }
    if (key in this.environments) return this.environments
    return this.globals
  }

  /*
   * Parse property access sequence from access string
   * @example
   * accessSeq("foo.bar")         // ['foo', 'bar']
   * accessSeq("foo['bar']")      // ['foo', 'bar']
   * accessSeq("foo['b]r']")      // ['foo', 'b]r']
   * accessSeq("foo[bar.coo]")    // ['foo', 'bar'], for bar.coo == 'bar'
   */
  private parseProp (str: string) {
    str = String(str)
    const seq: string[] = []
    const push = () => name.length && (seq.push(name), (name = ''))
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
          name += str[i++]
      }
    }
    push()

    if (!seq.length) {
      throw new TypeError(`invalid path:"${str}"`)
    }
    return seq
  }
}

export function readProperty (obj: Scope, key: string) {
  if (isNil(obj)) return obj
  obj = toLiquid(obj)
  if (obj instanceof Drop) {
    if (isFunction(obj[key])) return obj[key]()
    if (obj.hasOwnProperty(key)) return obj[key]
    return obj.liquidMethodMissing(key)
  }
  if (key === 'size') return readSize(obj)
  if (key === 'first') return readFirst(obj)
  if (key === 'last') return readLast(obj)
  return obj[key]
}

function readFirst (obj: Scope) {
  if (isArray(obj)) return obj[0]
  return obj['first']
}

function readLast (obj: Scope) {
  if (isArray(obj)) return obj[obj.length - 1]
  return obj['last']
}

function readSize (obj: Scope) {
  if (isArray(obj) || isString(obj)) return obj.length
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
