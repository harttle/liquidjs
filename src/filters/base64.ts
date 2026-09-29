/**
 * Base64 related filters
 *
 * Implements base64_encode and base64_decode filters for Shopify compatibility
 */

import { FilterImpl } from '../template'
import { stringify } from '../util'
import { base64Encode, base64Decode } from './base64-impl'

export function base64_encode (this: FilterImpl, value: string | Buffer): string {
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {
    this.context.memoryLimit.use(value.byteLength)
    return value.toString('base64')
  }
  const str = stringify(value)
  this.context.memoryLimit.use(str.length)
  return base64Encode(str)
}

export function base64_decode (this: FilterImpl, value: string): string {
  const str = stringify(value)
  this.context.memoryLimit.use(str.length)
  return isBase64(str) ? base64Decode(str) : ''
}

function isBase64 (str: string): boolean {
  str = str.replace(/[\t\n\f\r ]/g, '')
  if (str.length % 4 === 0) str = str.replace(/==?$/, '')
  return str.length % 4 !== 1 && /^[A-Za-z0-9+/]*$/.test(str)
}
