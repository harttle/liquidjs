import { rangeLine } from '../parser/lexical'
import { Context } from '../context/context'
import { range } from '../util/underscore'
import { Value } from './value'

export function isRange (token: string) {
  return token[0] === '(' && token[token.length - 1] === ')'
}

export function * rangeValue (token: string, ctx: Context) {
  let match
  if ((match = token.match(rangeLine))) {
    const low = yield new Value(match[1]).value(ctx)
    const high = yield new Value(match[2]).value(ctx)
    return range(+low, +high + 1)
  }
}
