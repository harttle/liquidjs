/*
 * Call functions in serial until someone resolved.
 * @param iterable the array to iterate with.
 * @param iteratee returns a new promise.
 * The iteratee is invoked with three arguments: (value, index, iterable).
 */
export function anySeries (iterable, iteratee) {
  let ret: Promise<any> = Promise.reject(new Error('init'))
  iterable.forEach(function (item, idx) {
    ret = ret.catch(() => iteratee(item, idx, iterable))
  })
  return ret
}

/*
 * Call functions in serial until someone rejected.
 * @param {Array} iterable the array to iterate with.
 * @param {Array} iteratee returns a new promise.
 * The iteratee is invoked with three arguments: (value, index, iterable).
 */
export function mapSeries (iterable, iteratee) {
  let ret: Promise<any> = Promise.resolve('init')
  const result = []
  iterable.forEach(function (item, idx) {
    ret = ret
      .then(() => iteratee(item, idx, iterable))
      .then(x => result.push(x))
  })
  return ret.then(() => result)
}
