const AssertionError = require('./error.js').AssertionError

function assert (predicate, message) {
  if (!predicate) {
    message = message || `expect ${predicate} to be true`
    throw new AssertionError(message)
  }
}

module.exports = assert
