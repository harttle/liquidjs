const toStr = Object.prototype.toString
const arrToStr = Array.prototype.toString

/*
 * Checks if value is classified as a String primitive or object.
 * @param {any} value The value to check.
 * @return {Boolean} Returns true if value is a string, else false.
 */
export function isString (value) {
  return toStr.call(value) === '[object String]'
}

export function isFunction (value) {
  return typeof value === 'function'
}

export function promisify (fn) {
  return function () {
    return new Promise((resolve, reject) => {
      fn(...arguments, (err, result) => {
        err ? reject(err) : resolve(result)
      })
    })
  }
}

export function stringify (value) {
  if (isNil(value)) return String(value)
  if (isFunction(value.to_liquid)) return stringify(value.to_liquid())
  if (isFunction(value.toLiquid)) return stringify(value.toLiquid())
  if (isFunction(value.to_s)) return value.to_s()
  if ([toStr, arrToStr].indexOf(value.toString) > -1) return defaultToString(value)
  if (isFunction(value.toString)) return value.toString()
  return toStr.call(value)
}

function defaultToString (value) {
  const cache = []
  return JSON.stringify(value, (key, value) => {
    if (isObject(value)) {
      if (cache.indexOf(value) !== -1) {
        return
      }
      cache.push(value)
    }
    return value
  })
}

export function create (proto) {
  return Object.create(proto)
}

export function isNil (value) {
  return value === null || value === undefined
}

export function isArray (value) {
  // be compatible with IE 8
  return toStr.call(value) === '[object Array]'
}

export function isError (value) {
  const signature = toStr.call(value)
  // [object XXXError]
  return signature.substr(-6, 5) === 'Error' ||
        (typeof value.message === 'string' && typeof value.name === 'string')
}

/*
 * Iterates over own enumerable string keyed properties of an object and invokes iteratee for each property.
 * The iteratee is invoked with three arguments: (value, key, object).
 * Iteratee functions may exit iteration early by explicitly returning false.
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @return {Object} Returns object.
 */
export function forOwn (object, iteratee) {
  object = object || {}
  for (const k in object) {
    if (object.hasOwnProperty(k)) {
      if (iteratee(object[k], k, object) === false) break
    }
  }
  return object
}

/*
 * Assigns own enumerable string keyed properties of source objects to the destination object.
 * Source objects are applied from left to right.
 * Subsequent sources overwrite property assignments of previous sources.
 *
 * Note: This method mutates object and is loosely based on Object.assign.
 *
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @return {Object} Returns object.
 */
export function assign (object) {
  object = isObject(object) ? object : {}
  const srcs = Array.prototype.slice.call(arguments, 1)
  srcs.forEach((src) => Object.assign(object, src))
  return object
}

export function last (arr) {
  return arr[arr.length - 1]
}

export function uniq (arr) {
  const u = {}
  const a = []
  for (let i = 0, l = arr.length; i < l; ++i) {
    if (u.hasOwnProperty(arr[i])) {
      continue
    }
    a.push(arr[i])
    u[arr[i]] = 1
  }
  return a
}

/*
 * Checks if value is the language type of Object.
 * (e.g. arrays, functions, objects, regexes, new Number(0), and new String(''))
 * @param {any} value The value to check.
 * @return {Boolean} Returns true if value is an object, else false.
 */
export function isObject (value) {
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}

/*
 * A function to create flexibly-numbered lists of integers,
 * handy for each and map loops. start, if omitted, defaults to 0; step defaults to 1.
 * Returns a list of integers from start (inclusive) to stop (exclusive),
 * incremented (or decremented) by step, exclusive.
 * Note that ranges that stop before they start are considered to be zero-length instead of
 * negative — if you'd like a negative range, use a negative step.
 */
export function range (start, stop, step) {
  if (arguments.length === 1) {
    stop = start
    start = 0
  }
  step = step || 1

  const arr = []
  for (let i = start; i < stop; i += step) {
    arr.push(i)
  }
  return arr
}
