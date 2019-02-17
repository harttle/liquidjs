import * as _ from './underscore'
import Token from 'src/parser/token'

function captureStack () {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor)
  }
}

abstract class LiquidError {
  name: string
  message: string
  stack: string
  private line: string
  private file: string
  private input: string
  private token: Token
  private originalError: Error
  constructor (err, token) {
    this.input = token.input
    this.line = token.line
    this.file = token.file
    this.originalError = err
    this.token = token
  }
  captureStackTrace (obj) {
    this.name = obj.constructor.name

    captureStack.call(obj)
    const err = this.originalError
    const context = mkContext(this.input, this.line)
    this.message = mkMessage(err.message, this.token)
    this.stack = this.message + '\n' + context +
      '\n' + (this.stack || this.message) +
        (err.stack ? '\nFrom ' + err.stack : '')
  }
}

export class TokenizationError extends LiquidError {
  constructor (message, token) {
    super({ message }, token)
    super.captureStackTrace(this)
  }
}
TokenizationError.prototype = _.create(Error.prototype) as any
TokenizationError.prototype.constructor = TokenizationError

export class ParseError extends LiquidError {
  constructor (err, token) {
    super(err, token)
    _.assign(this, err)
    super.captureStackTrace(this)
  }
}
ParseError.prototype = _.create(Error.prototype) as any
ParseError.prototype.constructor = ParseError

export class RenderError extends LiquidError {
  constructor (err, tpl) {
    super(err, tpl.token)
    _.assign(this, err)
    super.captureStackTrace(this)
  }
}
RenderError.prototype = _.create(Error.prototype) as any
RenderError.prototype.constructor = RenderError

export class RenderBreakError {
  message: string
  resolvedHTML: string
  constructor (message) {
    captureStack.call(this)
    this.message = message + ''
  }
}
RenderBreakError.prototype = _.create(Error.prototype) as any
RenderBreakError.prototype.constructor = RenderBreakError

export class AssertionError {
  message: string
  constructor (message) {
    captureStack.call(this)
    this.message = message + ''
  }
}
AssertionError.prototype = _.create(Error.prototype) as any
AssertionError.prototype.constructor = AssertionError

function mkContext (input, targetLine) {
  const lines = input.split('\n')
  const begin = Math.max(targetLine - 2, 1)
  const end = Math.min(targetLine + 3, lines.length)

  const context = _
    .range(begin, end + 1)
    .map(lineNumber => {
      const indicator = (lineNumber === targetLine) ? '>> ' : '   '
      const num = _.padStart(String(lineNumber), String(end).length)
      const text = lines[lineNumber - 1]
      return `${indicator}${num}| ${text}`
    })
    .join('\n')

  return context
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
