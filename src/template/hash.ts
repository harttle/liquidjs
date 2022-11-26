import { evalToken } from '../render/expression'
import { Context } from '../context/context'
import { Tokenizer } from '../parser/tokenizer'
import { Token } from '../tokens/token'

type HashValueTokens = Record<string, Token | undefined>

/**
 * Key-Value Pairs Representing Tag Arguments
 * Example:
 *    For the markup `, foo:'bar', coo:2 reversed %}`,
 *    hash['foo'] === 'bar'
 *    hash['coo'] === 2
 *    hash['reversed'] === undefined
 */
export class Hash {
  hash: HashValueTokens = {}
  constructor (markup: string, jekyllStyle?: boolean) {
    const tokenizer = new Tokenizer(markup, {})
    for (const hash of tokenizer.readHashes(jekyllStyle)) {
      this.hash[hash.name.content] = hash.value
    }
  }
  * render (ctx: Context): Generator<unknown, Record<string, any>, unknown> {
    const hash = {}
    for (const key of Object.keys(this.hash)) {
      hash[key] = this.hash[key] === undefined ? true : yield evalToken(this.hash[key], ctx)
    }
    return hash
  }
}
