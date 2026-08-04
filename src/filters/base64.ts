/**
 * Base64 related filters
 *
 * Implements base64_encode and base64_decode filters for Shopify compatibility
 */

import { FilterImpl } from '../template'
import { stringify } from '../util'
import { base64Encode, base64Decode, base64DecodeBytes } from './base64-impl'

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
  return base64Decode(str)
}

/**
 * Decodes a Base64 string into raw bytes without interpreting them as UTF-8.
 *
 * Returns a Buffer in Node.js and a Uint8Array in browsers.
 */
export function base64_decode_bytes (this: FilterImpl, value: string): Uint8Array {
  const str = stringify(value)
  const bytes = base64DecodeBytes(str)
  this.context.memoryLimit.use(bytes.byteLength)
  return bytes
}
