/**
 * Crypto related filters
 *
 * Implements sha256 and hmac_sha256 filters for Shopify compatibility
 */

import { FilterImpl } from '../template'
import { stringify } from '../util'
import { sha256 as sha256Impl, hmacSha256 as hmacSha256Impl } from './crypto-impl'

export function sha256 (this: FilterImpl, value: unknown): string | Promise<string> {
  const str = stringify(value)
  this.context.memoryLimit.use(str.length)
  return sha256Impl(str)
}

export function hmac_sha256 (this: FilterImpl, value: unknown, key: unknown): string | Promise<string> {
  const str = stringify(value)
  const keyStr = stringify(key)
  this.context.memoryLimit.use(str.length + keyStr.length)
  return hmacSha256Impl(str, keyStr)
}
