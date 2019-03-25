const toStr = Object.prototype.toString

/*
 * Checks if value is classified as a String primitive or object.
 * @param {any} value The value to check.
 * @return {Boolean} Returns true if value is a string, else false.
 */
export function isString (value: any): value is string {
  return toStr.call(value) === '[object String]'
}

export function isFunction (value: any): value is Function {
  return typeof value === 'function'
}

export function promisify<T1, T2> (fn: (arg1: T1, cb: (err: Error | null, result: T2) => void) => void): (arg1: T1) => Promise<T2>;
export function promisify<T1, T2, T3> (fn: (arg1: T1, arg2: T2, cb: (err: Error | null, result: T3) => void) => void):(arg1: T1, arg2: T2) => Promise<T3>;
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
  if (isNil(value)) return ''
  value = toLiquid(value)
  return String(value)
}

export function toLiquid (value: any): any {
  if (isFunction(value.toLiquid)) return toLiquid(value.toLiquid())
  return value
}

export function isNil (value: any): boolean {
  return value === null || value === undefined
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

export function range (start: number, stop: number, step: number = 1) {
  const arr: number[] = []
  for (let i = start; i < stop; i += step) {
    arr.push(i)
  }
  return arr
}

export function padStart (str: any, length: number, ch: string = ' ') {
  str = String(str)
  let n = length - str.length
  while (n-- > 0) str = ch + str
  return str
}
