
export function base64Encode (str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return btoa(binary)
}

export function base64Decode (str: string): string {
  return new TextDecoder().decode(
    Uint8Array.from(atob(str), c => c.charCodeAt(0))
  )
}
