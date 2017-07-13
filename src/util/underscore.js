/*
 * Checks if value is classified as a String primitive or object.
 * @param {any} value The value to check.
 * @return {Boolean} Returns true if value is a string, else false.
 */
function isString (value) {
  return value instanceof String || typeof value === 'string'
}

function isError (value) {
  var signature = Object.prototype.toString.call(value)
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
function forOwn (object, iteratee) {
  object = object || {}
  for (var k in object) {
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
function assign (object) {
  object = isObject(object) ? object : {}
  var srcs = Array.prototype.slice.call(arguments, 1)
  srcs.forEach(function (src) {
    _assignBinary(object, src)
  })
  return object
}

function _assignBinary (dst, src) {
  if (!dst) return dst
  forOwn(src, function (v, k) {
    dst[k] = v
  })
  return dst
}

function echo (prefix) {
  return v => {
    console.log('[' + prefix + ']', v)
    return v
  }
}

function uniq (arr) {
  var u = {}
  var a = []
  for (var i = 0, l = arr.length; i < l; ++i) {
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
function isObject (value) {
  var type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

/*
 * A function to create flexibly-numbered lists of integers,
 * handy for each and map loops. start, if omitted, defaults to 0; step defaults to 1.
 * Returns a list of integers from start (inclusive) to stop (exclusive),
 * incremented (or decremented) by step, exclusive.
 * Note that ranges that stop before they start are considered to be zero-length instead of
 * negative — if you'd like a negative range, use a negative step.
 */
function range (start, stop, step) {
  if (arguments.length === 1) {
    stop = start
    start = 0
  }
  step = step || 1

  var arr = []
  for (var i = start; i < stop; i += step) {
    arr.push(i)
  }
  return arr
}

exports.isString = isString
exports.isObject = isObject
exports.isError = isError

exports.range = range

exports.forOwn = forOwn
exports.assign = assign
exports.uniq = uniq

exports.echo = echo
