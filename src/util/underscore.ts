import { Drop } from '../drop/drop'

const toStr = Object.prototype.toString
const toLowerCase = String.prototype.toLowerCase

export function isString (value: any): value is string {
  return typeof value === 'string'
}

export function isFunction (value: any): value is Function {
  return typeof value === 'function'
}

export function promisify<T1, T2> (fn: (arg1: T1, cb: (err: Error | null, result: T2) => void) => void): (arg1: T1) => Promise<T2>;
export function promisify<T1, T2, T3> (fn: (arg1: T1, arg2: T2, cb: (err: Error | null, result: T3) => void) => void): (arg1: T1, arg2: T2) => Promise<T3>;
export function promisify (fn: any) {
  return function (...args: any[]) {
    return new Promise((resolve, reject) => {
      fn(...args, (err: Error, result: any) => {
        err ? reject(err) : resolve(result)
      })
    })
  }
}

export function stringify (value: any): string {
  value = toValue(value)
  if (isString(value)) return value
  if (isNil(value)) return ''
  return String(value)
}

export function toValue (value: any): any {
  return value instanceof Drop ? value.valueOf() : value
}

export function isNumber (value: any): value is number {
  return typeof value === 'number'
}

export function toLiquid (value: any): any {
  if (value && isFunction(value.toLiquid)) return toLiquid(value.toLiquid())
  return value
}

export function isNil (value: any): boolean {
  return value == null
}

export function isArray (value: any): value is any[] {
  // be compatible with IE 8
  return toStr.call(value) === '[object Array]'
}

/*
 * Iterates over own enumerable string keyed properties of an object and invokes iteratee for each property.
 * The iteratee is invoked with three arguments: (value, key, object).
 * Iteratee functions may exit iteration early by explicitly returning false.
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @return {Object} Returns object.
 */
export function forOwn <T> (
  object: {[key: string]: T} | undefined,
  iteratee: ((val: T, key: string, obj: {[key: string]: T}) => boolean | void)
) {
  object = object || {}
  for (const k in object) {
    if (object.hasOwnProperty(k)) {
      if (iteratee(object[k], k, object) === false) break
    }
  }
  return object
}

export function last <T>(arr: T[]): T;
export function last (arr: string): string;
export function last (arr: any[] | string): any | string {
  return arr[arr.length - 1]
}

/*
 * Checks if value is the language type of Object.
 * (e.g. arrays, functions, objects, regexes, new Number(0), and new String(''))
 * @param {any} value The value to check.
 * @return {Boolean} Returns true if value is an object, else false.
 */
export function isObject (value: any): value is object {
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}

export function range (start: number, stop: number, step = 1) {
  const arr: number[] = []
  for (let i = start; i < stop; i += step) {
    arr.push(i)
  }
  return arr
}

export function padStart (str: any, length: number, ch = ' ') {
  return pad(str, length, ch, (str, ch) => ch + str)
}

export function padEnd (str: any, length: number, ch = ' ') {
  return pad(str, length, ch, (str, ch) => str + ch)
}

export function pad (str: any, length: number, ch: string, add: (str: string, ch: string) => string) {
  str = String(str)
  let n = length - str.length
  while (n-- > 0) str = add(str, ch)
  return str
}

export function identify<T> (val: T): T {
  return val
}

export function snakeCase (str: string) {
  return str.replace(
    /(\w?)([A-Z])/g,
    (_, a, b) => (a ? a + '_' : '') + b.toLowerCase()
  )
}

export function changeCase (str: string): string {
  const hasLowerCase = [...str].some(ch => ch >= 'a' && ch <= 'z')
  return hasLowerCase ? str.toUpperCase() : str.toLowerCase()
}

export function ellipsis (str: string, N: number): string {
  return str.length > N ? str.substr(0, N - 3) + '...' : str
}

// compare string in case-insensitive way, undefined values to the tail
export function caseInsensitiveCompare (a: any, b: any) {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  a = toLowerCase.call(a)
  b = toLowerCase.call(b)
  if (a < b) return -1
  if (a > b) return 1
  return 0
}
