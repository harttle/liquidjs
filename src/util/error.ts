import * as _ from './underscore'
import Token from '../parser/token'
import ITemplate from '../template/itemplate'

abstract class LiquidError extends Error {
  private token: Token
  private originalError: Error
  constructor (err: Error, token: Token) {
    super(err.message)
    this.originalError = err
    this.token = token
  }
  protected update () {
    const err = this.originalError
    const context = mkContext(this.token)
    this.message = mkMessage(err.message, this.token)
    this.stack = this.message + '\n' + context +
      '\n' + this.stack + '\nFrom ' + err.stack
  }
}

export class TokenizationError extends LiquidError {
  constructor (message: string, token: Token) {
    super(new Error(message), token)
    this.name = 'TokenizationError'
    super.update()
  }
}

export class ParseError extends LiquidError {
  constructor (err: Error, token: Token) {
    super(err, token)
    this.name = 'ParseError'
    this.message = err.message
    super.update()
  }
}

export class RenderError extends LiquidError {
  constructor (err: Error, tpl: ITemplate) {
    super(err, tpl.token)
    this.name = 'RenderError'
    this.message = err.message
    super.update()
  }
}

export class RenderBreakError extends Error {
  resolvedHTML: string = ''
  constructor (message: string) {
    super(message)
    this.name = 'RenderBreakError'
    this.message = message + ''
  }
}

export class AssertionError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'AssertionError'
    this.message = message + ''
  }
}

function mkContext (token: Token) {
  const lines = token.input.split('\n')
  const begin = Math.max(token.line - 2, 1)
  const end = Math.min(token.line + 3, lines.length)

  const context = _
    .range(begin, end + 1)
    .map(lineNumber => {
      const indicator = (lineNumber === token.line) ? '>> ' : '   '
      const num = _.padStart(String(lineNumber), String(end).length)
      const text = lines[lineNumber - 1]
      return `${indicator}${num}| ${text}`
    })
    .join('\n')

  return context
}

function mkMessage (msg: string, token: Token) {
  if (token.file) msg += `, file:${token.file}`
  msg += `, line:${token.line}, col:${token.col}`
  return msg
}
