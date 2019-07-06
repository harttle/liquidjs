import { hashCapture } from '../../parser/lexical'
import { parseValue } from '../../render/syntax'
import Context from '../../context/context'

/**
 * Key-Value Pairs Representing Tag Arguments
 * Example:
 *    For the markup `{% include 'head.html' foo='bar' %}`,
 *    hash['foo'] === 'bar'
 */
export default class Hash {
  [key: string]: any
  public static async create (markup: string, ctx: Context) {
    const instance = new Hash()
    let match
    hashCapture.lastIndex = 0
    while ((match = hashCapture.exec(markup))) {
      const k = match[1]
      const v = match[2]
      instance[k] = await parseValue(v, ctx)
    }
    return instance
  }
}
