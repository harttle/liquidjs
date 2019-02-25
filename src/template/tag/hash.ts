import { hashCapture } from '../../parser/lexical'
import { evalValue } from '../../render/syntax'
import Scope from '../../scope/scope'

/**
 * Key-Value Pairs Representing Tag Arguments
 * Example:
 *    For the markup `{% include 'head.html' foo='bar' %}`,
 *    hash['foo'] === 'bar'
 */
export default class Hash {
  [key: string]: any
  constructor (markup: string, scope: Scope) {
    let match
    hashCapture.lastIndex = 0
    while ((match = hashCapture.exec(markup))) {
      const k = match[1]
      const v = match[2]
      this[k] = evalValue(v, scope)
    }
  }
}
