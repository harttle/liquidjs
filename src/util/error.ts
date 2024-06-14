import * as _ from './underscore'
import { Token } from '../tokens/token'
import { Template } from '../template/template'

/**
 * targeting ES5, extends Error won't create a proper prototype chain, need a trait to keep track of classes
 */
const TRAIT = '__liquidClass__'

export abstract class LiquidError extends Error {
  private token!: Token
  public context = ''
  private originalError?: Error
  public constructor (err: Error | string, token: Token) {
    /**
     * note: for ES5 targeting, `this` will be replaced by return value of Error(),
     * thus everything on `this` will be lost, avoid calling `LiquidError` methods here
     */
    super(typeof err === 'string' ? err : err.message)
    if (typeof err !== 'string') Object.defineProperty(this, 'originalError', { value: err, enumerable: false })
    Object.defineProperty(this, 'token', { value: token, enumerable: false })
    Object.defineProperty(this, TRAIT, { value: 'LiquidError', enumerable: false })
  }
  protected update () {
    Object.defineProperty(this, 'context', { value: mkContext(this.token), enumerable: false })
    this.message = mkMessage(this.message, this.token)
    this.stack = this.message + '\n' + this.context +
      '\n' + this.stack
    if (this.originalError) this.stack += '\nFrom ' + this.originalError.stack
  }
  static is (obj: unknown): obj is LiquidError {
    return obj?.[TRAIT] === 'LiquidError'
  }
}

export class TokenizationError extends LiquidError {
  public constructor (message: string, token: Token) {
    super(message, token)
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
  const [line, col] = token.getPosition()
  const lines = token.input.split('\n')
  const begin = Math.max(line - 2, 1)
  const end = Math.min(line + 3, lines.length)

  const context = _
    .range(begin, end + 1)
    .map(lineNumber => {
      const rowIndicator = (lineNumber === line) ? '>> ' : '   '
      const num = _.padStart(String(lineNumber), String(end).length)
      let text = `${rowIndicator}${num}| `

      const colIndicator = lineNumber === line
        ? '\n' + _.padStart('^', col + text.length)
        : ''

      text += lines[lineNumber - 1]
      text += colIndicator
      return text
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
