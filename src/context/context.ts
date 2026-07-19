import { Drop } from '../drop/drop'
import { __assign } from 'tslib'
import { NormalizedFullOptions, defaultOptions, RenderOptions } from '../liquid-options'
import { createScope, Scope, shouldBlockScopeKeyRead } from './scope'
import { hasOwnProperty, isArray, isNil, isUndefined, isString, isFunction, isNumber, toLiquid, InternalUndefinedVariableError, toValueSync, isObject, Limiter, toValue, readArrayElement } from '../util'

type PropertyKey = string | number;

export class Context {
  /**
   * insert a Context-level empty scope,
   * for tags like `{% capture %}` `{% assign %}` to operate
   */
  private scopes: Scope[] = [createScope()]
  private registers: Record<string, any> = {}
  /**
   * user passed in scope
   * `{% increment %}`, `{% decrement %}` changes this scope,
   * whereas `{% capture %}`, `{% assign %}` only hide this scope
   */
  public environments: Scope
  /**
   * global scope used as fallback for missing variables
   */
  public globals: Scope
  public sync: boolean
  public breakCalled = false
  public continueCalled = false
  /**
   * The normalized liquid options object
   */
  public opts: NormalizedFullOptions
  /**
   * Throw when accessing undefined variable?
   */
  public strictVariables: boolean;
  public ownPropertyOnly: boolean;
  public templateLimit: Limiter;
  public outputLengthLimit: Limiter;
  public depthLimit: Limiter;
  public constructor (env: object = {}, opts: NormalizedFullOptions = defaultOptions, renderOptions: RenderOptions = {}, { templateLimit, outputLengthLimit, depthLimit }: { templateLimit?: Limiter, outputLengthLimit?: Limiter, depthLimit?: Limiter } = {}) {
    this.sync = !!renderOptions.sync
    this.opts = opts
    this.globals = renderOptions.globals ?? opts.globals
    this.environments = isObject(env) ? env : Object(env)
    this.strictVariables = renderOptions.strictVariables ?? this.opts.strictVariables
    this.ownPropertyOnly = renderOptions.ownPropertyOnly ?? opts.ownPropertyOnly
    this.templateLimit = templateLimit ?? new Limiter('template', renderOptions.templateLimit ?? opts.templateLimit)
    this.outputLengthLimit = outputLengthLimit ?? new Limiter('output length', renderOptions.outputLengthLimit ?? opts.outputLengthLimit)
    this.depthLimit = depthLimit ?? new Limiter('template depth', opts.maxDepth)
  }
  public getRegister<T> (key: string, defaultValue: T = undefined as T): T {
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
  /**
   * @deprecated use `_get()` or `getSync()` instead
   */
  public get (paths: PropertyKey[]): unknown {
    return this.getSync(paths)
  }
  public getSync (paths: PropertyKey[]): unknown {
    return toValueSync(this._get(paths))
  }
  public * _get (paths: (PropertyKey | Drop)[]): IterableIterator<unknown> {
    const scope = this.findScope(paths[0] as string) // first prop should always be a string
    return yield this._getFromScope(scope, paths)
  }
  /**
   * @deprecated use `_get()` instead
   */
  public getFromScope (scope: unknown, paths: PropertyKey[] | string): IterableIterator<unknown> {
    return toValueSync(this._getFromScope(scope, paths))
  }
  public * _getFromScope (scope: unknown, paths: (PropertyKey | Drop)[] | string, strictVariables = this.strictVariables): IterableIterator<unknown> {
    if (isString(paths)) paths = paths.split('.')
    for (let i = 0; i < paths.length; i++) {
      scope = yield this.readProperty(scope as object, paths[i])
      if (strictVariables && isUndefined(scope)) {
        throw new InternalUndefinedVariableError((paths as string[]).slice(0, i + 1).join!('.'))
      }
    }
    return scope
  }
  public push (ctx: Scope): Scope {
    const scope = ctx instanceof Drop
      ? ctx
      : Object.getPrototypeOf(ctx) === null
        ? ctx
        : createScope(ctx)
    this.scopes.push(scope)
    return scope
  }
  public pop () {
    return this.scopes.pop()
  }
  public bottom () {
    return this.scopes[0]
  }
  public spawn (scope = {}) {
    return new Context(scope, this.opts, {
      sync: this.sync,
      globals: this.globals,
      strictVariables: this.strictVariables,
      ownPropertyOnly: this.ownPropertyOnly
    }, {
      templateLimit: this.templateLimit,
      outputLengthLimit: this.outputLengthLimit,
      depthLimit: this.depthLimit
    })
  }
  private findScope (key: string | number) {
    const hasKey = (obj: Scope) => {
      if (obj == null) return false
      return this.ownPropertyOnly
        ? hasOwnProperty.call(obj, key)
        : key in obj
    }
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      const candidate = this.scopes[i]
      if (hasKey(candidate)) return candidate
    }
    if (hasKey(this.environments)) return this.environments
    return this.globals
  }
  readProperty (obj: Scope, key: (PropertyKey | Drop)) {
    obj = toLiquid(obj)
    key = toValue(key) as PropertyKey
    if (isNil(obj)) return obj
    if (isArray(obj) && isNumber(key)) return readArrayElement(obj, key, this.ownPropertyOnly)
    const value = readJSProperty(obj, key, this.ownPropertyOnly)
    if (value === undefined && obj instanceof Drop) return obj.liquidMethodMissing(key, this)
    if (isFunction(value)) return value.call(obj)
    if (key === 'size') return this.readSize(obj)
    else if (key === 'first') return this.readFirst(obj)
    else if (key === 'last') return this.readLast(obj)
    return value
  }
  private readFirst (obj: Scope) {
    if (isArray(obj)) return readArrayElement(obj, 0, this.ownPropertyOnly)
    return readJSProperty(obj, 'first', this.ownPropertyOnly)
  }
  private readLast (obj: Scope) {
    if (isArray(obj)) return readArrayElement(obj, -1, this.ownPropertyOnly)
    return readJSProperty(obj, 'last', this.ownPropertyOnly)
  }
  private readSize (obj: Scope) {
    if (hasOwnProperty.call(obj, 'size')) return obj['size']
    if (!this.ownPropertyOnly && obj['size'] !== undefined) return obj['size']
    if (isArray(obj) || isString(obj)) return obj.length
    if (obj instanceof Map || obj instanceof Set) return obj.size
    if (typeof obj === 'object') return Object.keys(obj).length
  }
}

export function readJSProperty (obj: Scope, key: PropertyKey, ownPropertyOnly: boolean) {
  if (shouldBlockScopeKeyRead(obj, key, ownPropertyOnly)) return undefined
  if (ownPropertyOnly && !hasOwnProperty.call(obj, key) && !(obj instanceof Drop)) return undefined
  return obj[key]
}
