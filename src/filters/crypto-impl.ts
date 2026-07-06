import { createHash, createHmac } from 'crypto'

export function sha256 (str: string): string {
  return createHash('sha256').update(str, 'utf8').digest('hex')
}

export function hmacSha256 (str: string, key: string): string {
  return createHmac('sha256', key).update(str, 'utf8').digest('hex')
}
