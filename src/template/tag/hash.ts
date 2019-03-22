import { hashCapture } from '../../parser/lexical'
import { evalValue } from '../../render/syntax'
import Context from '../../context/context'

/**
 * Key-Value Pairs Representing Tag Arguments
 * Example:
 *    For the markup `{% include 'head.html' foo='bar' %}`,
 *    hash['foo'] === 'bar'
 */
export default class Hash {
  [key: string]: any
  static async create (markup: string, ctx: Context) {
    const instance = new Hash()
    let match
    hashCapture.lastIndex = 0
    while ((match = hashCapture.exec(markup))) {
      const k = match[1]
      const v = match[2]
      instance[k] = await evalValue(v, ctx)
    }
    return instance
  }
}
