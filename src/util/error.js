const _ = require('./underscore.js')

function initError () {
  this.name = this.constructor.name
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor)
  }
}

function initLiquidError (err, token) {
  initError.call(this)

  this.input = token.input
  this.line = token.line
  this.file = token.file

  var context = mkContext(token.input, token.line)
  this.message = mkMessage(err.message, token)
  this.stack = context +
    '\n' + (this.stack || this.message) +
      (err.stack ? '\nFrom ' + err.stack : '')
}

function TokenizationError (message, token) {
  initLiquidError.call(this, {message: message}, token)
}
TokenizationError.prototype = Object.create(Error.prototype)
TokenizationError.prototype.constructor = TokenizationError

function ParseError (e, token) {
  _.assign(this, e)
  this.originalError = e

  initLiquidError.call(this, e, token)
}
ParseError.prototype = Object.create(Error.prototype)
ParseError.prototype.constructor = ParseError

function RenderError (e, tpl) {
  // return the original render error
  if (e instanceof RenderError) {
    return e
  }
  _.assign(this, e)
  this.originalError = e

  initLiquidError.call(this, e, tpl.token)
}
RenderError.prototype = Object.create(Error.prototype)
RenderError.prototype.constructor = RenderError

function RenderBreakError (message) {
  initError.call(this)
  this.message = message + ''
}
RenderBreakError.prototype = Object.create(Error.prototype)
RenderBreakError.prototype.constructor = RenderBreakError

function AssertionError (message) {
  initError.call(this)
  this.message = message + ''
}
AssertionError.prototype = Object.create(Error.prototype)
AssertionError.prototype.constructor = AssertionError

function mkContext (input, line) {
  var lines = input.split('\n')
  var begin = Math.max(line - 2, 1)
  var end = Math.min(line + 3, lines.length)

  var context = _
    .range(begin, end + 1)
    .map(l => [
      (l === line) ? '>> ' : '   ',
      align(l, end),
      '| ',
      lines[l - 1]
    ].join(''))
    .join('\n')

  return context
}

function align (n, max) {
  var length = (max + '').length
  var str = n + ''
  var blank = Array(length - str.length).join(' ')
  return blank + str
}

function mkMessage (msg, token) {
  msg = msg || ''
  if (token.file) {
    msg += ', file:' + token.file
  }
  if (token.line) {
    msg += ', line:' + token.line
  }
  return msg
}

module.exports = {
  TokenizationError,
  ParseError,
  RenderBreakError,
  AssertionError,
  RenderError
}
