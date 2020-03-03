import { isArray } from '../util/underscore'

type KeyValuePair = [string?, string?]

export type FilterArg = string|KeyValuePair

export function isKeyValuePair (arr: FilterArg): arr is KeyValuePair {
  return isArray(arr)
}
