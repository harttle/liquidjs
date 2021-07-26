import * as _ from './underscore'
import { Token } from '../tokens/token'
import { Template } from '../template/template'

export abstract class LiquidError extends Error {
  private token: Token
  public context: string
  private originalError: Error
  public constructor (err: Error, token: Token) {
    super(err.message)
    this.originalError = err
    this.token = token
    this.context = ''
  }
  protected update () {
    const err = this.originalError
    this.context = mkContext(this.token)
    this.message = mkMessage(err.message, this.token)
    this.stack = this.message + '\n' + this.context +
      '\n' + this.stack + '\nFrom ' + err.stack
  }
}

export class TokenizationError extends LiquidError {
  public constructor (message: string, token: Token) {
    super(new Error(message), token)
    this.name = 'TokenizationError'
    super.update()
  }
}

export class ParseError extends LiquidError {
  public constructor (err: Error, token: Token) {
    super(err, token)
    this.name = 'ParseError'
    this.message = err.message
    super.update()
  }
}

export class RenderError extends LiquidError {
  public constructor (err: Error, tpl: Template) {
    super(err, tpl.token)
    this.name = 'RenderError'
    this.message = err.message
    super.update()
  }
  public static is (obj: any): obj is RenderError {
    return obj.name === 'RenderError'
  }
}

export class UndefinedVariableError extends LiquidError {
  public constructor (err: Error, token: Token) {
    super(err, token)
    this.name = 'UndefinedVariableError'
    this.message = err.message
    super.update()
  }
}

// only used internally; raised where we don't have token information,
// so it can't be an UndefinedVariableError.
export class InternalUndefinedVariableError extends Error {
  variableName: string

  public constructor (variableName: string) {
    super(`undefined variable: ${variableName}`)
    this.name = 'InternalUndefinedVariableError'
    this.variableName = variableName
  }
}

export class AssertionError extends Error {
  public constructor (message: string) {
    super(message)
    this.name = 'AssertionError'
    this.message = message + ''
  }
}

function mkContext (token: Token) {
  const [line] = token.getPosition()
  const lines = token.input.split('\n')
  const begin = Math.max(line - 2, 1)
  const end = Math.min(line + 3, lines.length)

  const context = _
    .range(begin, end + 1)
    .map(lineNumber => {
      const indicator = (lineNumber === line) ? '>> ' : '   '
      const num = _.padStart(String(lineNumber), String(end).length)
      const text = lines[lineNumber - 1]
      return `${indicator}${num}| ${text}`
    })
    .join('\n')

  return context
}

function mkMessage (msg: string, token: Token) {
  if (token.file) msg += `, file:${token.file}`
  const [line, col] = token.getPosition()
  msg += `, line:${line}, col:${col}`
  return msg
}
