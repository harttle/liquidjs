import { AssertionError } from './error.js'

export default function (predicate, message) {
  if (!predicate) {
    message = message || `expect ${predicate} to be true`
    throw new AssertionError(message)
  }
}
