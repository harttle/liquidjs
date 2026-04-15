export function base64Encode (value: string | Buffer): string {
  if (Buffer.isBuffer(value)) {
    return value.toString('base64')
  }
  return Buffer.from(value, 'utf8').toString('base64')
}

export function base64Decode (str: string): string {
  return Buffer.from(str, 'base64').toString('utf8')
}
