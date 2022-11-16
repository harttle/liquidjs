import { isPromise, isIterator } from './underscore'

// convert an async iterator to a Promise
export async function toPromise<T> (val: Generator<unknown, T, unknown> | Promise<T> | T): Promise<T> {
  if (!isIterator(val)) return val
  let value: unknown
  let done = false
  let next = 'next'
  do {
    const state = val[next](value)
    done = state.done
    value = state.value
    next = 'next'
    try {
      if (isIterator(value)) value = toPromise(value)
      if (isPromise(value)) value = await value
    } catch (err) {
      next = 'throw'
      value = err
    }
  } while (!done)
  return value as T
}

// convert an async iterator to a value in a synchronous manner
export function toValueSync<T> (val: Generator<unknown, T, unknown> | T): T {
  if (!isIterator(val)) return val
  let value: any
  let done = false
  let next = 'next'
  do {
    const state = val[next](value)
    done = state.done
    value = state.value
    next = 'next'
    if (isIterator(value)) {
      try {
        value = toValueSync(value)
      } catch (err) {
        next = 'throw'
        value = err
      }
    }
  } while (!done)
  return value
}
