import { AssertionError } from './error'

export function assert <T> (predicate: T | null | undefined, message?: () => string) {
  if (!predicate) {
    const msg = message ? message() : `expect ${predicate} to be true`
    throw new AssertionError(msg)
  }
}
