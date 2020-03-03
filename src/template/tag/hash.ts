import { Expression } from '../../render/expression'
import { Context } from '../../context/context'
import { Tokenizer } from '../../parser/tokenizer'

/**
 * Key-Value Pairs Representing Tag Arguments
 * Example:
 *    For the markup `, foo:'bar', coo:2 reversed %}`,
 *    hash['foo'] === 'bar'
 *    hash['coo'] === 2
 *    hash['reversed'] === undefined
 */
export class Hash {
  [key: string]: any
  constructor (markup: string) {
    const tokenizer = new Tokenizer(markup)
    for (const [name, value] of tokenizer.readHashes()) {
      this[name] = value
    }
  }
  * render (ctx: Context) {
    const hash = {}
    for (const key of Object.keys(this)) {
      hash[key] = yield new Expression(this[key]).evaluate(ctx)
    }
    return hash
  }
}
