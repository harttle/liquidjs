import * as _ from './underscore'

function captureStack () {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor)
  }
}

abstract class LiquidError {
  input: string
  line: string
  file: string
  message: string
  name: string
  stack: string
  token: any
  originalError: any
  constructor(err, token) {
    this.input = token.input
    this.line = token.line
    this.file = token.file
    this.originalError = err
    this.token = token
  }
  captureStackTrace(obj) {
    this.name = obj.constructor.name

    captureStack.call(obj)
    const err = this.originalError
    const context = mkContext(this.input, this.line)
    this.message = mkMessage(err.message, this.token)
    this.stack = context +
      '\n' + (this.stack || this.message) +
        (err.stack ? '\nFrom ' + err.stack : '')
  }
}

export class TokenizationError extends LiquidError {
  constructor(message, token) {
    super({message}, token)
    super.captureStackTrace(this)
  }
}
TokenizationError.prototype = _.create(Error.prototype)
TokenizationError.prototype.constructor = TokenizationError

export class ParseError extends LiquidError {
  constructor(err, token) {
    super(err, token)
    _.assign(this, err)
    super.captureStackTrace(this)
  }
}
ParseError.prototype = _.create(Error.prototype)
ParseError.prototype.constructor = ParseError

export class RenderError extends LiquidError {
  constructor(err, tpl) {
    super(err, tpl.token)
    _.assign(this, err)
    super.captureStackTrace(this)
  }
}
RenderError.prototype = _.create(Error.prototype)
RenderError.prototype.constructor = RenderError

export class RenderBreakError {
  message: string
  constructor (message) {
    captureStack.call(this)
    this.message = message + ''
  }
}
RenderBreakError.prototype = _.create(Error.prototype)
RenderBreakError.prototype.constructor = RenderBreakError

export class AssertionError {
  message: string
  constructor (message) {
    captureStack.call(this)
    this.message = message + ''
  }
}
AssertionError.prototype = _.create(Error.prototype)
AssertionError.prototype.constructor = AssertionError

function mkContext (input, targetLine) {
  const lines = input.split('\n')
  const begin = Math.max(targetLine - 2, 1)
  const end = Math.min(targetLine + 3, lines.length)

  const context = _
    .range(begin, end + 1)
    .map(lineNumber => {
      const indicator = (lineNumber === targetLine) ? '>> ' : '   '
      const num = padStart(String(end).length, lineNumber)
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

function padStart (length, str) {
  str = String(str)
  const blank = Array(length - str.length).join(' ')
  return blank + str
}
