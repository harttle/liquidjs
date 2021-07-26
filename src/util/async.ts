import { isFunction } from './underscore'

type resolver = (x?: any) => any

interface Thenable {
  then (resolve: resolver, reject?: resolver): Thenable;
  catch (reject: resolver): Thenable;
}

function createResolvedThenable (value: any): Thenable {
  const ret = {
    then: (resolve: resolver) => resolve(value),
    catch: () => ret
  }
  return ret
}

function createRejectedThenable (err: Error): Thenable {
  const ret = {
    then: (resolve: resolver, reject?: resolver) => {
      if (reject) return reject(err)
      return ret
    },
    catch: (reject: resolver) => reject(err)
  }
  return ret
}

function isThenable (val: any): val is Thenable {
  return val && isFunction(val.then)
}

function isAsyncIterator (val: any): val is IterableIterator<any> {
  return val && isFunction(val.next) && isFunction(val.throw) && isFunction(val.return)
}

// convert an async iterator to a thenable (Promise compatible)
export function toThenable (val: IterableIterator<any> | Thenable | any): Thenable {
  if (isThenable(val)) return val
  if (isAsyncIterator(val)) return reduce()
  return createResolvedThenable(val)

  function reduce (prev?: any): Thenable {
    let state
    try {
      state = (val as IterableIterator<any>).next(prev)
    } catch (err) {
      return createRejectedThenable(err)
    }

    if (state.done) return createResolvedThenable(state.value)
    return toThenable(state.value!).then(reduce, err => {
      let state
      try {
        state = (val as IterableIterator<any>).throw!(err)
      } catch (e) {
        return createRejectedThenable(e)
      }
      if (state.done) return createResolvedThenable(state.value)
      return reduce(state.value)
    })
  }
}

export function toPromise (val: IterableIterator<any> | Thenable | any): Promise<any> {
  return Promise.resolve(toThenable(val))
}

// get the value of async iterator in synchronous manner
export function toValue (val: IterableIterator<any> | Thenable | any) {
  let ret: any
  toThenable(val)
    .then((x: any) => {
      ret = x
      return createResolvedThenable(ret)
    })
    .catch((err: Error) => {
      throw err
    })
  return ret
}
