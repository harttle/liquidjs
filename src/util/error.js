import * as _ from './underscore.js'

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

  const context = mkContext(token.input, token.line)
  this.message = mkMessage(err.message, token)
  this.stack = context +
    '\n' + (this.stack || this.message) +
      (err.stack ? '\nFrom ' + err.stack : '')
}

export function TokenizationError (message, token) {
  initLiquidError.call(this, { message: message }, token)
}
TokenizationError.prototype = _.create(Error.prototype)
TokenizationError.prototype.constructor = TokenizationError

export function ParseError (e, token) {
  _.assign(this, e)
  this.originalError = e

  initLiquidError.call(this, e, token)
}
ParseError.prototype = _.create(Error.prototype)
ParseError.prototype.constructor = ParseError

export function RenderError (e, tpl) {
  // return the original render error
  if (e instanceof RenderError) {
    return e
  }
  _.assign(this, e)
  this.originalError = e

  initLiquidError.call(this, e, tpl.token)
}
RenderError.prototype = _.create(Error.prototype)
RenderError.prototype.constructor = RenderError

export function RenderBreakError (message) {
  initError.call(this)
  this.message = message + ''
}
RenderBreakError.prototype = _.create(Error.prototype)
RenderBreakError.prototype.constructor = RenderBreakError

export function AssertionError (message) {
  initError.call(this)
  this.message = message + ''
}
AssertionError.prototype = _.create(Error.prototype)
AssertionError.prototype.constructor = AssertionError

function mkContext (input, line) {
  const lines = input.split('\n')
  const begin = Math.max(line - 2, 1)
  const end = Math.min(line + 3, lines.length)

  const context = _
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
  const length = (max + '').length
  const str = n + ''
  const blank = Array(length - str.length).join(' ')
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
