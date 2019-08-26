import { hashCapture } from '../../parser/lexical'
import { Expression } from '../../render/expression'
import { Context } from '../../context/context'

/**
 * Key-Value Pairs Representing Tag Arguments
 * Example:
 *    For the markup `{% include 'head.html' foo='bar' %}`,
 *    hash['foo'] === 'bar'
 */
export class Hash {
  [key: string]: any
  private static parse (markup: string) {
    const instance = new Hash()
    let match
    hashCapture.lastIndex = 0
    while ((match = hashCapture.exec(markup))) {
      const k = match[1]
      const v = match[2]
      instance[k] = v
    }
    return instance
  }
  public static createSync (markup: string, ctx: Context) {
    const instance = Hash.parse(markup)
    for (const key of Object.keys(instance)) {
      instance[key] = new Expression(instance[key]).evaluateSync(ctx)
    }
    return instance
  }
  public static async create (markup: string, ctx: Context) {
    const instance = Hash.parse(markup)
    for (const key of Object.keys(instance)) {
      instance[key] = await new Expression(instance[key]).evaluate(ctx)
    }
    return instance
  }
}
