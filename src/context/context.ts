import { getPerformance } from '../util/performance'
import { Drop } from '../drop/drop'
import { __assign } from 'tslib'
import { NormalizedFullOptions, defaultOptions, RenderOptions } from '../liquid-options'
import { createScope, Scope } from './scope'
import { hasOwnProperty, isArray, isNil, isUndefined, isString, isFunction, isNumber, toLiquid, InternalUndefinedVariableError, toValueSync, isObject, Limiter, TimeLimiter, toValue, readArrayElement, readSize, isPromise, isIterator } from '../util'

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
   * Reference to the Liquid instance for filter resolution
   */
  public liquid?: any
  /**
   * Throw when accessing undefined variable?
   */
  public strictVariables: boolean;
  public ownPropertyOnly: boolean;
  public memoryLimit: Limiter;
  public renderLimit: TimeLimiter;
  public constructor (env: object = {}, opts: NormalizedFullOptions = defaultOptions, renderOptions: RenderOptions = {}, { memoryLimit, renderLimit, liquid }: { memoryLimit?: Limiter, renderLimit?: TimeLimiter, liquid?: any } = {}) {
    this.sync = !!renderOptions.sync
    this.opts = opts
    this.globals = renderOptions.globals ?? opts.globals
    this.environments = isObject(env) ? env : Object(env)
    this.strictVariables = renderOptions.strictVariables ?? this.opts.strictVariables
    this.ownPropertyOnly = renderOptions.ownPropertyOnly ?? opts.ownPropertyOnly
    this.memoryLimit = memoryLimit ?? new Limiter('memory alloc', renderOptions.memoryLimit ?? opts.memoryLimit)
    this.renderLimit = renderLimit ?? new TimeLimiter('template render', getPerformance().now() + (renderOptions.renderLimit ?? opts.renderLimit))
    this.liquid = liquid
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
  /**
   * Returns the value, or a generator that finishes the lookup when a Promise or iterator is met.
   */
  public _get (paths: (PropertyKey | Drop)[]): unknown {
    const scope = this.findScope(paths[0] as string) // first prop should always be a string
    return this._getFromScope(scope, paths)
  }
  /**
   * @deprecated use `_get()` instead
   */
  public getFromScope (scope: unknown, paths: PropertyKey[] | string): IterableIterator<unknown> {
    return toValueSync(this._getFromScope(scope, paths)) as IterableIterator<unknown>
  }
  /**
   * Returns the value, or a generator that finishes the lookup when a Promise or iterator is met.
   */
  public _getFromScope (scope: unknown, paths: (PropertyKey | Drop)[] | string, strictVariables = this.strictVariables): unknown {
    if (isString(paths)) paths = paths.split('.')
    return this.readPath(scope, paths, strictVariables, 0)
  }
  private readPath (scope: unknown, paths: (PropertyKey | Drop)[], strictVariables: boolean, start: number): unknown {
    for (let i = start; i < paths.length; i++) {
      scope = this.readProperty(scope as object, paths[i])
      if (isPromise(scope) || isIterator(scope)) return this.resumeFromScope(scope, paths, strictVariables, i)
      this.assertDefined(scope, paths, strictVariables, i)
    }
    return scope
  }
  private * resumeFromScope (pending: unknown, paths: (PropertyKey | Drop)[], strictVariables: boolean, i: number): Generator<unknown, unknown, unknown> {
    const scope = yield pending
    this.assertDefined(scope, paths, strictVariables, i)
    return yield this.readPath(scope, paths, strictVariables, i + 1)
  }
  private assertDefined (scope: unknown, paths: (PropertyKey | Drop)[], strictVariables: boolean, i: number) {
    if (strictVariables && isUndefined(scope)) {
      throw new InternalUndefinedVariableError((paths as string[]).slice(0, i + 1).join('.'))
    }
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
  public spawn (scope = {}) {
    return new Context(scope, this.opts, {
      sync: this.sync,
      globals: this.globals,
      strictVariables: this.strictVariables,
      ownPropertyOnly: this.ownPropertyOnly
    }, {
      renderLimit: this.renderLimit,
      memoryLimit: this.memoryLimit,
      liquid: this.liquid
    })
  }
  private findScope (key: string | number) {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      const candidate = this.scopes[i]
      if (key in candidate) return candidate
    }
    if (key in this.environments) return this.environments
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
    if (key === 'size') return readSize(obj)
    else if (key === 'first') return readFirst(obj, this.ownPropertyOnly)
    else if (key === 'last') return readLast(obj, this.ownPropertyOnly)
    return value
  }
}

export function readJSProperty (obj: Scope, key: PropertyKey, ownPropertyOnly: boolean) {
  if (ownPropertyOnly && !hasOwnProperty.call(obj, key) && !(obj instanceof Drop)) return undefined
  return obj[key]
}

function readFirst (obj: Scope, ownPropertyOnly: boolean) {
  if (isArray(obj)) return readArrayElement(obj, 0, ownPropertyOnly)
  return readJSProperty(obj, 'first', ownPropertyOnly)
}

function readLast (obj: Scope, ownPropertyOnly: boolean) {
  if (isArray(obj)) return readArrayElement(obj, -1, ownPropertyOnly)
  return readJSProperty(obj, 'last', ownPropertyOnly)
}
