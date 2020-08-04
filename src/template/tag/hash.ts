import { evalToken } from '../../render/expression'
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
  hash: { [key: string]: any } = {}
  constructor (markup: string) {
    const tokenizer = new Tokenizer(markup)
    for (const hash of tokenizer.readHashes()) {
      this.hash[hash.name.content] = hash.value
    }
  }
  * render (ctx: Context) {
    const hash = {}
    for (const key of Object.keys(this.hash)) {
      hash[key] = yield evalToken(this.hash[key], ctx)
    }
    return hash
  }
}
