import { isFunction } from './underscore'

type resolver = (x?: any) => any

export interface Thenable<T> {
  then (resolve: resolver, reject?: resolver): Thenable<T>;
  catch (reject: resolver): Thenable<T>;
}

function isThenable<T> (val: any): val is Thenable<T> {
  return val && isFunction(val.then)
}

function isAsyncIterator (val: any): val is IterableIterator<any> {
  return val && isFunction(val.next) && isFunction(val.throw) && isFunction(val.return)
}

// convert an async iterator to a Promise
export async function toPromise<T> (val: Generator<unknown, T, unknown> | Thenable<T> | T): Promise<T> {
  if (!isAsyncIterator(val)) return val
  let value: unknown
  let done = false
  let next = 'next'
  do {
    const state = val[next](value)
    done = state.done
    value = state.value
    next = 'next'
    try {
      if (isAsyncIterator(value)) value = toPromise(value)
      if (isThenable(value)) value = await value
    } catch (err) {
      next = 'throw'
      value = err
    }
  } while (!done)
  return value as T
}

// convert an async iterator to a value in a synchronous maner
export function toValue<T> (val: Generator<unknown, T, unknown> | T): T {
  if (!isAsyncIterator(val)) return val
  let value: any
  let done = false
  let next = 'next'
  do {
    const state = val[next](value)
    done = state.done
    value = state.value
    next = 'next'
    if (isAsyncIterator(value)) {
      try {
        value = toValue(value)
      } catch (err) {
        next = 'throw'
        value = err
      }
    }
  } while (!done)
  return value
}

export const toThenable = toPromise
