import { AssertionError } from './error'

export default function<T> (predicate: T | null | undefined, message?: string) {
  if (!predicate) {
    message = message || `expect ${predicate} to be true`
    throw new AssertionError(message)
  }
}
