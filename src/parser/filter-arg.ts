import { isArray } from '../util/underscore'
import { ValueToken } from '../tokens/value-token'

type KeyValuePair = [string?, ValueToken?]

export type FilterArg = ValueToken | KeyValuePair

export function isKeyValuePair (arr: FilterArg): arr is KeyValuePair { // TODO check
  return isArray(arr)
}
