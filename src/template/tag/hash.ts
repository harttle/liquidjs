import { hashCapture } from 'src/parser/lexical'
import { evalValue } from 'src/render/syntax'

/**
 * Key-Value Pairs Representing Tag Arguments
 * Example:
 *    For the markup `{% include 'head.html' foo='bar' %}`,
 *    hash['foo'] === 'bar'
 */
export default class Hash {
  constructor(markup, scope) {
    let match
    hashCapture.lastIndex = 0
    while ((match = hashCapture.exec(markup))) {
      const k = match[1]
      const v = match[2]
      this[k] = evalValue(v, scope)
    }
  }
}
