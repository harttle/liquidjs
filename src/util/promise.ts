/*
 * Call functions in serial until someone rejected.
 * @param {Array} iterable the array to iterate with.
 * @param {Array} iteratee returns a new promise.
 * The iteratee is invoked with three arguments: (value, index, iterable).
 */
export function mapSeries<T1, T2> (
  iterable: T1[],
  iteratee: (item: T1, idx: number, iterable: T1[]) => Promise<T2> | T2
): Promise<T2[]> {
  let ret = Promise.resolve(0)
  const result: T2[] = []
  iterable.forEach(function (item, idx) {
    ret = ret
      .then(() => iteratee(item, idx, iterable))
      .then(x => result.push(x))
  })
  return ret.then(() => result)
}
