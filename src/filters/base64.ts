/**
 * Base64 related filters
 *
 * Implements base64_encode and base64_decode filters for Shopify compatibility
 */

import { FilterImpl } from '../template'
import { stringify } from '../util'
import { base64Encode, base64Decode } from './base64-impl'

export function base64_encode (this: FilterImpl, value: string): string {
  const str = stringify(value)
  this.context.memoryLimit.use(str.length)
  return base64Encode(str)
}

export function base64_decode (this: FilterImpl, value: string): string {
  const str = stringify(value)
  this.context.memoryLimit.use(str.length)
  return base64Decode(str)
}
