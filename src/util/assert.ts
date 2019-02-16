import { AssertionError } from './error'

export default function (predicate: any, message?: string) {
  if (!predicate) {
    message = message || `expect ${predicate} to be true`
    throw new AssertionError(message)
  }
}
