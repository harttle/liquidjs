import { AssertionError } from './error'

export function assert <T> (predicate: T | null | undefined, message?: string | (() => string)) {
  if (!predicate) {
    const msg = typeof message === 'function'
      ? message()
      : (message || `expect ${predicate} to be true`)
    throw new AssertionError(msg)
  }
}
