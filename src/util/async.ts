import { isFunction } from './underscore'

type resolver = (x?: any) => any

export interface Thenable<T> {
  then (resolve: resolver, reject?: resolver): Thenable<T>;
  catch (reject: resolver): Thenable<T>;
}

function createResolvedThenable<T> (value: T): Thenable<T> {
  const ret = {
    then: (resolve: resolver) => resolve(value),
    catch: () => ret
  }
  return ret
}

function createRejectedThenable<T> (err: Error): Thenable<T> {
  const ret = {
    then: (resolve: resolver, reject?: resolver) => {
      if (reject) return reject(err)
      return ret
    },
    catch: (reject: resolver) => reject(err)
  }
  return ret
}

function isThenable<T> (val: any): val is Thenable<T> {
  return val && isFunction(val.then)
}

function isAsyncIterator (val: any): val is IterableIterator<any> {
  return val && isFunction(val.next) && isFunction(val.throw) && isFunction(val.return)
}

// convert an async iterator to a thenable (Promise compatible)
export function toThenable<T> (val: IteratorResult<unknown, T> | Thenable<T> | any): Thenable<T> {
  if (isThenable(val)) return val
  if (isAsyncIterator(val)) return reduce()
  return createResolvedThenable(val)

  function reduce<T> (prev?: T): Thenable<T> {
    let state
    try {
      state = val.next(prev)
    } catch (err) {
      return createRejectedThenable(err as Error)
    }

    if (state.done) return createResolvedThenable(state.value)
    return toThenable(state.value!).then(reduce, err => {
      let state
      try {
        state = val.throw!(err)
      } catch (e) {
        return createRejectedThenable(e as Error)
      }
      if (state.done) return createResolvedThenable(state.value)
      return reduce(state.value)
    })
  }
}

export function toPromise<T> (val: Generator<unknown, T, unknown> | Thenable<T> | T): Promise<T> {
  return Promise.resolve(toThenable(val))
}

// get the value of async iterator in synchronous manner
export function toValue<T> (val: Generator<unknown, T, unknown> | Thenable<T> | T): T {
  let ret: T
  toThenable(val)
    .then((x: any) => {
      ret = x
      return createResolvedThenable(ret)
    })
    .catch((err: Error) => {
      throw err
    })
  return ret!
}
