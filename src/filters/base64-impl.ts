export function base64Encode (str: string): string {
  return Buffer.from(str, 'utf8').toString('base64')
}

export function base64Decode (str: string): string {
  return Buffer.from(str, 'base64').toString('utf8')
}

export function base64DecodeBytes (str: string): Uint8Array {
  return Buffer.from(str, 'base64')
}
